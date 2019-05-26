<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <span>DannyAAM's Radio</span>
        <span>&nbsp;</span>
        <span class="font-weight-light caption">{{ playing.title }} - {{ playing.artist }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        prepend-icon="search"
        v-model="search"
        solo
        append-icon="cancel"
        hide-details
        single-line
      >
      </v-text-field>
      <v-btn icon>
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer fixed v-model="drawer" app>
      <v-list dense>
        <v-list-tile @click.stop="left = !left">
          <v-list-tile-action>
            <v-icon>search</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Test</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <ul>
        <li v-for="song in songlist">
          {{ song.title }}
        </li>
      </ul>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

const config = {
  eps: {
    playing:  "http://live.saru.moe/music/songctl2/data/playing.php",
    songlist: "http://live.saru.moe/music/songctl2/data/songlist.php",
  },
  list_limit: 50,
};

export default {
  name: "App",
  components: {
    HelloWorld
  },
  data() {
    return {
      drawer: true,
      search: "",
      playing: {},
      songlist: [],
      lastQuery: "", // for endless scroll
      bottom: false,
    };
  },
  created() {
    window.addEventListener('scroll', () => {
      this.bottom = this.bottomVisible();
    })
    this.getPlaying();
    this.getSonglist();
  },
  mounted() {
  },
  watch: {
    search(val) {
      this.getSonglist("search="+val);
    },
    bottom(bottom) {
      if (bottom) this.getSonglist(true);
    },
  },
  methods: {
    getPlaying() {
      this.$http.get(config.eps.playing).then((response) => {
        response.json().then((json) => {
          this.playing = json;
        });
      });
    },
    getSonglist(query) { // query === true => append mode
      let append = false;
      if (query === true) {
        append = true;
        query = `start=${this.songlist.length}&${this.lastQuery}`;
      } else {
        this.lastQuery = query = query || "";
      }
      this.$http.get(`${config.eps.songlist}?limit=${config.list_limit}&${query}`).then((response) => {
        response.json().then((json) => {
          if (append) {
            this.songlist = this.songlist.concat(json.songlist.slice(0, -1))
          } else {
            this.songlist = json.songlist.slice(0, -1);
          }
        });
      });
    },
    bottomVisible() {
      const scrollY = window.scrollY;
      const visible = document.documentElement.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const bottomOfPage = visible + scrollY >= pageHeight;
      return bottomOfPage || pageHeight < visible;
    },
  }
};
</script>
