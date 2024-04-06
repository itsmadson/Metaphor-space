import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:parse_server_sdk_flutter/parse_server_sdk_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  const keyApplicationId = 'urkey';
  const keyClientKey = 'key';
  const keyParseServerUrl = 'https://parseapi.back4app.com';

  await Parse().initialize(keyApplicationId, keyParseServerUrl,
      clientKey: keyClientKey, autoSendSessionId: true);

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'فضای استعاره',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF40E0D0),
          brightness: Brightness.dark,
        ),
        brightness: Brightness.dark,
        fontFamily: 'Vazirmatn',
      ),
      home: const Directionality(
        textDirection: TextDirection.rtl,
        child: HomePage(),
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late Future<List<ParseObject>> storiesFuture;
  List<String> likedStories = [];
  List<ParseObject> stories = [];

  @override
  void initState() {
    super.initState();
    storiesFuture = _fetchStories();
    _loadLikedStories();
  }

  Future<List<ParseObject>> _fetchStories() async {
    final queryBuilder = QueryBuilder<ParseObject>(ParseObject('story'))
      ..orderByDescending('createdAt');

    final result = await queryBuilder.query();
    if (result.success && result.results != null) {
      stories = result.results as List<ParseObject>;
      return result.results as List<ParseObject>;
    } else {
      print('Failed to fetch stories: ${result.error?.message}');
      return [];
    }
  }

  Future<void> _loadLikedStories() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      likedStories = prefs.getStringList('likedStories') ?? [];
    });
  }

  Future<void> _saveLikedStories() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('likedStories', likedStories);
  }

  Future<void> _toggleLike(String objectId) async {
    setState(() {
      if (likedStories.contains(objectId)) {
        likedStories.remove(objectId);
      } else {
        likedStories.add(objectId);
      }
      _saveLikedStories();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(
            kToolbarHeight + 20.0), // Adjust the height as needed
        child: AppBar(
          shape: const RoundedRectangleBorder(
            borderRadius: BorderRadius.vertical(
              bottom: Radius.circular(
                  20.0), // Set the radius for the bottom corners
            ),
          ),
          backgroundColor: Theme.of(context).primaryColor,
          elevation: 0, // No shadow
          title: const Text(
            'فضای استعاره',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 20.0,
            ),
          ),
          actions: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.search),
                  onPressed: () {
                    showSearch(
                      context: context,
                      delegate: StorySearchDelegate(stories: stories),
                    );
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.favorite),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => Directionality(
                          textDirection: TextDirection.rtl,
                          child: LikedStoriesPage(
                            likedStories: likedStories,
                            stories: stories,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ),
      body: FutureBuilder<List<ParseObject>>(
        future: storiesFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else {
            final stories = snapshot.data ?? [];
            return ListView.builder(
              itemCount: stories.length,
              itemBuilder: (context, index) {
                final story = stories[index];
                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => StoryDetailsPage(
                          name: story['name'] as String,
                          author: story['author'] as String,
                          date: story['date'] as String,
                          image: story['image'] as String,
                          text: story['text'] as String,
                        ),
                      ),
                    );
                  },
                  child: StoryCard(
                    name: story['name'] as String,
                    author: story['author'] as String,
                    date: story['date'] as String,
                    description: story['description'] as String,
                    image: story['image'] as String,
                    isLiked: likedStories.contains(story.objectId),
                    onLikePressed: () => _toggleLike(story.objectId ?? ''),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => StoryDetailsPage(
                            name: story['name'] as String,
                            author: story['author'] as String,
                            date: story['date'] as String,
                            image: story['image'] as String,
                            text: story['text'] as String,
                          ),
                        ),
                      );
                    },
                  ),
                );
              },
            );
          }
        },
      ),
    );
  }
}

class StoryCard extends StatelessWidget {
  final String name;
  final String author;
  final String date;
  final String description;
  final String image;
  final bool isLiked;
  final VoidCallback onLikePressed;
  final VoidCallback onPressed;

  const StoryCard({
    super.key,
    required this.name,
    required this.author,
    required this.date,
    required this.description,
    required this.image,
    required this.isLiked,
    required this.onLikePressed,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(15),
      elevation: 4.0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: GestureDetector(
        onTap: onPressed,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
              ),
              child: Stack(
                children: [
                  Image.network(
                    image,
                    fit: BoxFit.cover,
                  ),
                  Container(
                    decoration: BoxDecoration(
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(20),
                        topRight: Radius.circular(20),
                      ),
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withOpacity(0.0),
                          Colors.black.withOpacity(0.5),
                        ],
                        stops: const [0.0, 1.0],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    textAlign: TextAlign.right,
                    style: const TextStyle(
                      fontSize: 18.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    'نویسنده: $author',
                    textAlign: TextAlign.right,
                    style: const TextStyle(
                      fontSize: 14.0,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  Text(
                    date,
                    textAlign: TextAlign.right,
                    style: const TextStyle(
                      fontSize: 14.0,
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  Text(
                    description,
                    textAlign: TextAlign.right,
                    style: const TextStyle(
                      fontSize: 16.0,
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      isLiked ? Icons.favorite : Icons.favorite_border,
                      color: isLiked
                          ? const Color.fromARGB(255, 0, 255, 204)
                          : null,
                    ),
                    onPressed: onLikePressed,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class LikedStoriesPage extends StatelessWidget {
  final List<String> likedStories;
  final List<ParseObject> stories;

  const LikedStoriesPage({
    super.key,
    required this.likedStories,
    required this.stories,
  });

  @override
  Widget build(BuildContext context) {
    final likedStoryCards = likedStories.map((storyId) {
      final likedStory = stories.firstWhere(
        (story) => story.objectId == storyId,
        orElse: () => ParseObject('story'),
      );
      return StoryCard(
        key: Key(storyId),
        name: likedStory['name'] as String,
        author: likedStory['author'] as String,
        date: likedStory['date'] as String,
        description: likedStory['description'] as String,
        image: likedStory['image'] as String,
        isLiked: true,
        onLikePressed: () {},
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => StoryDetailsPage(
                name: likedStory['name'] as String,
                author: likedStory['author'] as String,
                date: likedStory['date'] as String,
                image: likedStory['image'] as String,
                text: likedStory['text'] as String,
              ),
            ),
          );
        },
      );
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('داستان های مورد علاقت (='),
      ),
      body: ListView(
        children: likedStoryCards,
      ),
    );
  }
}

class StorySearchDelegate extends SearchDelegate<String> {
  final List<ParseObject> stories;

  StorySearchDelegate({required this.stories});

  @override
  String get searchFieldLabel =>
      'دنبال کدوم داستانی؟'; // Change placeholder text

  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
        icon: const Icon(Icons.clear),
        onPressed: () {
          query = '';
        },
      )
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.arrow_back),
      onPressed: () {
        close(context, '');
      },
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    final results = stories.where((story) {
      final name = story['name'] as String;
      final author = story['author'] as String;
      return name.toLowerCase().contains(query.toLowerCase()) ||
          author.toLowerCase().contains(query.toLowerCase());
    }).toList();

    return ListView.builder(
      itemCount: results.length,
      itemBuilder: (context, index) {
        final story = results[index];
        return ListTile(
          title: Text(story['name'] as String),
          subtitle: Text('نویسنده: ${story['author']}'),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => StoryDetailsPage(
                  name: story['name'] as String,
                  author: story['author'] as String,
                  date: story['date'] as String,
                  image: story['image'] as String,
                  text: story['text'] as String,
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    final results = stories.where((story) {
      final name = story['name'] as String;
      final author = story['author'] as String;
      return name.toLowerCase().contains(query.toLowerCase()) ||
          author.toLowerCase().contains(query.toLowerCase());
    }).toList();

    return ListView.builder(
      itemCount: results.length,
      itemBuilder: (context, index) {
        final story = results[index];
        return ListTile(
          title: Text(story['name'] as String),
          subtitle: Text('نویسنده: ${story['author']}'),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => StoryDetailsPage(
                  name: story['name'] as String,
                  author: story['author'] as String,
                  date: story['date'] as String,
                  image: story['image'] as String,
                  text: story['text'] as String,
                ),
              ),
            );
          },
        );
      },
    );
  }
}

class StoryDetailsPage extends StatelessWidget {
  final String name;
  final String author;
  final String date;
  final String image;
  final String text;

  const StoryDetailsPage({
    super.key,
    required this.name,
    required this.author,
    required this.date,
    required this.image,
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        body: NestedScrollView(
          headerSliverBuilder: (context, innerBoxIsScrolled) {
            return [
              SliverAppBar(
                pinned: true,
                backgroundColor: Colors.transparent,
                elevation: 0,
                leading: IconButton(
                  icon: const Icon(Icons.arrow_back),
                  onPressed: () {
                    Navigator.pop(context);
                  },
                ),
                expandedHeight: 250.0,
                flexibleSpace: Stack(
                  fit: StackFit.expand,
                  children: [
                    ClipRRect(
                      borderRadius: const BorderRadius.only(
                        bottomLeft: Radius.circular(20.0),
                        bottomRight: Radius.circular(20.0),
                      ),
                      child: Image.network(
                        image,
                        fit: BoxFit.cover,
                        color: Colors.black.withOpacity(0.2),
                        colorBlendMode: BlendMode.darken,
                      ),
                    ),
                    Positioned(
                      bottom: 16.0,
                      left: 0,
                      right: 0,
                      child: Center(
                        child: Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(20.0),
                            color: Colors.black.withOpacity(0.5),
                          ),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 16.0, vertical: 4.0),
                          child: Text(
                            name,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 22.0,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.only(
                    bottomLeft:
                        Radius.circular(innerBoxIsScrolled ? 20.0 : 0.0),
                    bottomRight:
                        Radius.circular(innerBoxIsScrolled ? 20.0 : 0.0),
                  ),
                ),
              ),
            ];
          },
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'نویسنده: $author',
                  style: const TextStyle(
                    fontSize: 16.0,
                    fontStyle: FontStyle.italic,
                  ),
                ),
                const SizedBox(height: 8.0),
                Text(
                  date,
                  style: const TextStyle(
                    fontSize: 14.0,
                  ),
                ),
                const SizedBox(height: 8.0),
                Text(
                  text,
                  style: const TextStyle(
                    fontSize: 18.0,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
