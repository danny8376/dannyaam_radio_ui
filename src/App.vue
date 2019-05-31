<template>
  <v-app v-scroll="checkBottomVisible">
    <v-snackbar v-model="alert.show" :color="alert.color" top>
      {{ alert.message }}
      <v-btn icon @click="alert.show = false">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-snackbar>
    <v-toolbar app clipped-left>
      <v-toolbar-side-icon
        @click.stop="showDrawer = !showDrawer"
      ></v-toolbar-side-icon>
      <v-toolbar-title>
        DannyAAM's Radio
      </v-toolbar-title>
      <v-btn icon @click.stop="playPause">
        <v-icon v-if="audio5js.playing">pause</v-icon>
        <v-icon v-if="!audio5js.playing">play_arrow</v-icon>
      </v-btn>
      <span v-if="!isMobile" class="font-weight-light caption">{{
        playing.titleShow
      }}</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="showSearch = !showSearch">
        <v-icon>search</v-icon>
      </v-btn>
      <v-expand-x-transition>
        <v-text-field
          v-model="search"
          v-if="showSearch"
          placeholder="搜尋歌曲(使用foobar2000搜尋格式)"
          solo
          clearable
          hide-details
          single-line
          autofocus
          class="nav-search"
        >
        </v-text-field>
      </v-expand-x-transition>
      <v-menu bottom left>
        <template #activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-tile @click.stop="getAllInfo">
            <v-list-tile-action>
              <v-icon>refresh</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>更新狀態</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click.stop="">
            <v-list-tile-action>
              <v-icon>person</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>會員功能</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-dialog v-model="news.show" lazy scrollable max-width="50em">
            <template #activator="{ on }">
              <v-list-tile v-on="on">
                <v-list-tile-action>
                  <v-icon>history</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>更新紀錄</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
            <v-card>
              <v-card-title>
                <span class="title">更新紀錄</span>
                <v-spacer></v-spacer>
                <v-btn icon small @click.stop="news.show = false">
                  <v-icon>clear</v-icon>
                </v-btn>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <div v-html="news.content"></div>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-list>
      </v-menu>
      <v-btn icon @click.stop="showChat = !showChat">
        <v-icon>chat_bubble</v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer fixed clipped v-model="showDrawer" app>
      <v-list dense>
        <v-list-tile href="/music">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>回首頁</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="http://live.saru.moe/radioplaying">
          <v-list-tile-action>
            <v-icon>info</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>目前播放曲目資訊</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="http://cn.last.fm/user/danny8376/tracks">
          <v-list-tile-action>
            <v-icon>open_in_browser</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Last.fm 播放紀錄</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="http://tlk.io/DannyAAMsRadio">
          <v-list-tile-action>
            <v-icon>chat_bubble</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>直接開啟聊天室</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-tabs v-model="artAlbumTab" centered>
        <v-tab ripple :key="0">歌手</v-tab>
        <v-tab ripple :key="1">專輯</v-tab>
        <v-tab-item :key="0">
          <ItemList
            name="歌手"
            :list="artists"
            @action="searchArtist($event)"
          ></ItemList>
        </v-tab-item>
        <v-tab-item :key="1">
          <ItemList
            name="專輯"
            :list="albums"
            @action="searchAlbum($event)"
          ></ItemList>
        </v-tab-item>
      </v-tabs>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="showChat"
      fixed
      right
      app
      :temporary="isMobile"
    >
      <div
        id="tlkio"
        data-channel="DannyAAMsRadio"
        style="width:100%;height:100%;"
      ></div>
    </v-navigation-drawer>

    <v-content v-resize="onResize">
      <PlayingInfo
        :playing="playing"
        :albumart="albumart"
        @artist="searchArtist($event)"
        @album="searchAlbum($event)"
      ></PlayingInfo>
      <v-expansion-panel v-model="panel" expand>
        <v-expansion-panel-content :key="0">
          <template #header>
            <div class="title">
              點播清單
            </div>
          </template>
          <SongList
            :songlist="reqlist"
            :isMobile="isMobile"
            @action="cancelRequest($event)"
            @artist="searchArtist($event)"
            @album="searchAlbum($event)"
          ></SongList>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-toolbar dense flat color="white">
        <v-toolbar-title>{{
          songlistTitle.length ? songlistTitle : "歌曲清單"
        }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.stop="clearSearch" v-if="songlistTitle.length">
          <v-icon>cancel</v-icon>
        </v-btn>
      </v-toolbar>
      <SongList
        :songlist="songlist"
        :isMobile="isMobile"
        @action="requestSong($event)"
        @artist="searchArtist($event)"
        @album="searchAlbum($event)"
      ></SongList>
    </v-content>
  </v-app>
</template>

<script>
import SongList from "./components/SongList";
import ItemList from "./components/ItemList";
import PlayingInfo from "./components/PlayingInfo";

import Audio5js from "audio5";

import "./tlk.io-embed-moded";

const config = {
  eps: {
    playing: `${process.env.VUE_APP_EPS_BASE}/data/playing.php`,
    songlist: `${process.env.VUE_APP_EPS_BASE}/data/songlist.php`,
    reqlist: `${process.env.VUE_APP_EPS_BASE}/data/requestlist.php`,
    albums: `${process.env.VUE_APP_EPS_BASE}/data/albumlist.php`,
    artists: `${process.env.VUE_APP_EPS_BASE}/data/artistlist.php`,
    albumart: `${process.env.VUE_APP_EPS_BASE}/data/albumart.php`,
    msg: `${process.env.VUE_APP_EPS_BASE}/data/message.php`,
    news: `${process.env.VUE_APP_EPS_BASE}/news.php`
  },
  stream: {
    vorbis: [
      "http://std1.ladio.net:8070/dannyAAM",
      "http://hebi.saru.moe:8000/radio-ogg"
    ],
    opus: ["http://hebi.saru.moe:8000/radio-opus"],
    mp3: ["http://hebi.saru.moe:8000/radio-mp3"]
  },
  //fiferswf: process.env.VUE_APP_FIFER_FLASH,
  audio5swf: process.env.VUE_APP_AUDIO5_FLASH,
  list_limit: 50
};

export default {
  name: "App",
  components: {
    SongList,
    ItemList,
    PlayingInfo
  },
  data() {
    return {
      isMobile: false,
      showDrawer: false,
      showSearch: false,
      showChat: false,
      alert: {
        show: false,
        color: "info",
        message: ""
      },
      news: {
        show: false,
        content: ""
      },
      panel: [true],
      artAlbumTab: 0,
      search: "",
      playing: {},
      playProgress: {
        percent: 0,
        text: ""
      },
      playTimer: 0,
      albumart: "",
      songlistTitle: "",
      songlist: [],
      reqlist: [],
      artists: [],
      albums: [],
      lastQuery: {
        query: "",
        size: -1
      }, // for endless scroll
      bottom: false,
      tlkio: false,
      audio5js: {
        playing: false
      }
    };
  },
  created() {
    this.onResize(); // check mobile
    this.showDrawer = !this.isMobile; // don't show by default if mobile
    this.showChat = !this.isMobile; // don't show by default if mobile
    this.startPlayTimer();
    this.getAllInfo();
  },
  mounted() {},
  watch: {
    "news.show"(val) {
      if (val) {
        this.$http.get(config.eps.news).then(response => {
          this.news.content = response.body;
        });
      }
    },
    playing(playing) {
      playing.titleShow = `${playing.title} - ${playing.artist}`;
      document.title = `[ ${playing.titleShow} ] - DannyAAM's Radio`;
      this.albumart = `${config.eps.albumart}?_=${new Date().getTime()}`;
    },
    search(val) {
      if (val) {
        this.getSonglist("search=" + val);
        this.songlistTitle = "搜尋：" + val;
      } else {
        this.getSonglist();
        this.songlistTitle = "";
      }
    },
    showChat(showChat) {
      if (showChat && !this.tlkio) {
        this.tlkio = true;
        this.initTlkio();
      }
    },
    bottom(bottom) {
      if (bottom) this.getSonglist(true);
    }
  },
  methods: {
    getAllInfo() {
      this.getPlaying();
      this.getReqlist();
      this.getArtists();
      this.getAlbums();
      this.getSonglist();
    },
    startPlayTimer() {
      this.playTimer = setInterval(() => {
        this.playing.playback_time_seconds++;
        if (this.playing.playback_time_seconds >= this.playing.length_seconds) {
          this.getPlaying();
          this.getReqlist();
        }
      }, 1000);
    },
    onResize() {
      if (window.innerWidth < 769) this.isMobile = true;
      else this.isMobile = false;
    },
    getPlaying() {
      this.$http.get(config.eps.playing).then(response => {
        response.json().then(json => {
          this.playing = json;
        });
      });
    },
    getArtists() {
      this.$http.get(config.eps.artists).then(response => {
        response.json().then(json => {
          this.artists = json.map(text => {
            if (text.length) {
              return {
                text: text,
                value: text
              };
            } else {
              return {
                text: "<未知歌手>",
                value: null
              };
            }
          });
        });
      });
    },
    getAlbums() {
      this.$http.get(config.eps.albums).then(response => {
        response.json().then(json => {
          this.albums = json.map(text => {
            if (text.length) {
              return {
                text: text,
                value: text
              };
            } else {
              return {
                text: "<未知專輯>",
                value: null
              };
            }
          });
        });
      });
    },
    getReqlist() {
      this.$http.get(config.eps.reqlist).then(response => {
        response.json().then(json => {
          this.reqlist = json.requestlist.map(song => {
            song.action = {
              text: "",
              act: ""
            };
            if (song.is_requested === 1) {
              song.action.text = "取消";
              song.action.act = "cancel";
            }
            return song;
          });
        });
      });
    },
    getSonglist(query) {
      // query === true => append mode
      let append = false;
      if (query === true) {
        append = true;
        query = `start=${this.songlist.length}&${this.lastQuery.query}`;
      } else {
        this.lastQuery.query = query = query || "";
        this.lastQuery.size = -1; // -1 means no query before
      }
      if (
        this.lastQuery.size == -1 ||
        this.songlist.length < this.lastQuery.size
      ) {
        this.$http
          .get(`${config.eps.songlist}?limit=${config.list_limit}&${query}`)
          .then(response => {
            response.json().then(json => {
              const list = json.songlist.map(song => {
                song.action = {
                  text: "點播",
                  act: "request"
                };
                return song;
              });
              if (append) {
                this.songlist = this.songlist.concat(list);
              } else {
                this.songlist = list;
              }
              this.lastQuery.size = json.total_size;
            });
          });
      }
    },
    searchArtist(art) {
      if (art === "?") art = null; // ? means no value for current backend system
      this.getSonglist(
        art === null ? "noartist=1" : `artist=${encodeURIComponent(art)}`
      );
      this.songlistTitle = `歌手：${art === null ? "未知" : art}`;
    },
    searchAlbum(album) {
      if (album === "?") album = null; // ? means no value for current backend system
      this.getSonglist(
        album === null ? "noalbum=1" : `album=${encodeURIComponent(album)}`
      );
      this.songlistTitle = `專輯：${album === null ? "未知" : album}`;
    },
    clearSearch() {
      this.search = "";
      this.getSonglist();
      this.songlistTitle = "";
    },
    requestSong(song) {
      this.$http
        .post(config.eps.msg, {
          cmd: "request",
          list_id: song.list_id,
          song_id: song.song_id
        })
        .then(response => {
          response.json().then(json => {
            this.alert.show = true;
            this.alert.color = json.status;
            this.alert.message = json.message;
            this.getReqlist();
          });
        });
    },
    cancelRequest(song) {
      if (song.action.act) {
        this.$http
          .post(config.eps.msg, {
            cmd: "remove",
            list_id: song.list_id,
            song_id: song.song_id
          })
          .then(response => {
            response.json().then(json => {
              this.alert.show = true;
              this.alert.color = json.status;
              this.alert.message = json.message;
              this.getReqlist();
            });
          });
      }
    },
    checkBottomVisible() {
      const scrollY =
        window.scrollY ||
        window.pageYOffset ||
        document.body.scrollTop +
          ((document.documentElement && document.documentElement.scrollTop) ||
            0);
      const visible = document.documentElement.clientHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const bottomOfPage = visible + scrollY >= pageHeight - 60;
      this.bottom = bottomOfPage || pageHeight < visible;
    },
    initTlkio() {
      window.initTlkio();
      /*
      const script = document.createElement("script");
      script.setAttribute("src", "//tlk.io/embed.js");
      document.body.appendChild(script);
      */
    },
    initAudio5js() {
      return new Promise((success, reject) => {
        window.audio5js = this.audio5js = new Audio5js({
          swf_path: config.audio5swf,
          throw_errors: false,
          codecs: ["vorbis", "opus", "mp3"],
          ready(player) {
            this.on(
              "canplay",
              () => {
                success(this);
              },
              this
            );
            this.on(
              "error",
              error => {
                if (error.message.indexOf("Load") !== -1) {
                  // load error
                  this.streamIdx++;
                  if (this.streamIdx < this.stream.length) {
                    this.load(this.stream[this.streamIdx]);
                  } else {
                    reject(error);
                  }
                }
              },
              this
            );
            this.stream = config.stream[player.codec];
            this.streamIdx = 0;
            this.load(this.stream[this.streamIdx]);
          }
        });
      });
    },
    async playPause() {
      if (typeof this.audio5js.stream === "undefined") {
        await this.initAudio5js();
      }
      if (this.audio5js.playing) {
        this.audio5js.pause();
      } else {
        this.audio5js.play();
      }
    }
  }
};
</script>

<style scoped>
.nav-search {
  min-width: 50%;
}
</style>
