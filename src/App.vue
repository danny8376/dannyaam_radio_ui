<template>
  <v-app
    :dark="dark"
    v-scroll="checkBottomVisible"
    :style="{ backgroundImage: bgStyle }"
  >
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
      <v-toolbar-title v-show="!isMobile || !showSearch">
        DannyAAM's Radio
      </v-toolbar-title>
      <v-btn icon @click.stop="playPause" v-show="!isMobile || !showSearch">
        <v-icon v-if="player.audio5js.playing">pause</v-icon>
        <v-icon v-else>play_arrow</v-icon>
      </v-btn>
      <v-menu
        transition="slide-y-transition"
        min-width="150"
        :close-on-content-click="false"
        :open-on-hover="!isMobile"
        :close-delay="isMobile ? 0 : 500"
        offset-y
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" v-show="!isMobile || !showSearch">
            <v-icon v-if="player.volume === 0">volume_off</v-icon>
            <v-icon v-else>volume_up</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-slider
              v-model="player.volume"
              prepend-icon="volume_down"
              @click:prepend.stop="player.volume = 0"
              append-icon="volume_up"
              @click:append.stop="player.volume = 1"
              max="1"
              step="0.01"
            ></v-slider>
          </v-card-text>
        </v-card>
      </v-menu>
      <span v-if="!isMobile" class="font-weight-light caption">{{
        playing.titleShow
      }}</span>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="showSearch = !showSearch">
        <v-icon>search</v-icon>
      </v-btn>
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
      <v-menu offset-y bottom left>
        <template #activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-list class="app-more">
          <v-list-tile @click.stop="getAllInfo">
            <v-list-tile-avatar>
              <v-icon>refresh</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>更新狀態</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click.stop="dark = !dark">
            <v-list-tile-avatar>
              <v-icon>brightness_3</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>暗色主題</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-switch readonly v-model="dark"></v-switch>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile @click.stop="bg.enable = !bg.enable">
            <v-list-tile-avatar>
              <v-icon>landscape</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>圖片背景</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-switch readonly v-model="bg.enable"></v-switch>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile @click.stop="changeBg" v-if="bg.enable">
            <v-list-tile-avatar>
              <v-icon>collections</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>切換背景</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click.stop="endlessScroll = !endlessScroll">
            <v-list-tile-avatar>
              <v-icon>unfold_more</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>無限捲動</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-switch readonly v-model="endlessScroll"></v-switch>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile @click.stop="">
            <v-list-tile-avatar>
              <v-icon>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>會員功能</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-dialog v-model="news.show" lazy scrollable max-width="50em">
            <template #activator="{ on }">
              <v-list-tile v-on="on">
                <v-list-tile-avatar>
                  <v-icon>history</v-icon>
                </v-list-tile-avatar>
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
          <v-list-tile-avatar>
            <v-icon>home</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>回首頁</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="http://live.saru.moe/radioplaying">
          <v-list-tile-avatar>
            <v-icon>info</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>目前播放曲目資訊</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="http://cn.last.fm/user/danny8376/tracks">
          <v-list-tile-avatar>
            <v-icon>open_in_browser</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Last.fm 播放紀錄</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile href="http://tlk.io/DannyAAMsRadio">
          <v-list-tile-avatar>
            <v-icon>chat_bubble</v-icon>
          </v-list-tile-avatar>
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
        :data-custom-css="tlkio.cssFile"
        style="width:100%;height:100%;"
      ></div>
    </v-navigation-drawer>

    <v-content v-resize="onResize">
      <v-expansion-panel v-model="panel" expand>
        <v-expansion-panel-content :key="0">
          <template #header>
            <div class="title">
              播放中
            </div>
          </template>
          <PlayingInfo
            :playing="playing"
            :albumart="albumart"
            @artist="searchArtist($event)"
            @album="searchAlbum($event)"
          ></PlayingInfo>
        </v-expansion-panel-content>
        <v-expansion-panel-content :key="1">
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
        <v-expansion-panel-content :key="2">
          <template #header>
            <div class="title">
              {{ songlistTitle.length ? songlistTitle : "歌曲清單" }}
            </div>
            <v-spacer></v-spacer>
            <v-btn
              small
              icon
              style="flex-grow: 0;"
              @click.stop="clearSearch"
              v-if="songlistTitle.length"
            >
              <v-icon>cancel</v-icon>
            </v-btn>
          </template>
          <SongList
            :songlist="songlist"
            :isMobile="isMobile"
            :pagination.sync="pagination"
            :loading="loading"
            @action="requestSong($event)"
            @artist="searchArtist($event)"
            @album="searchAlbum($event)"
          ></SongList>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-content>
    <link
      rel="stylesheet"
      type="text/css"
      href="local-css/bgimage.css"
      v-if="this.bg.enable"
    />
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
  bgs: {
    size: 7,
    prefix: "//live.saru.moe/music/songctl2/img/bg/",
    suffix: ".jpg",
    list: []
  },
  stream: {
    vorbis: [
      "http://std1.ladio.net:8070/dannyAAM",
      "http://hebi.saru.moe:8000/radio-ogg"
    ],
    opus: ["http://hebi.saru.moe:8000/radio-opus"],
    mp3: ["http://hebi.saru.moe:8000/radio-mp3"]
  },
  tlkio: {
    cssLight: "",
    cssDark: "//live.saru.moe/music/songctl3/local-css/tlkio-night.css"
  },
  //fiferswf: process.env.VUE_APP_FIFER_FLASH,
  audio5swf: process.env.VUE_APP_AUDIO5_FLASH,
  append_list_limit: 50
};

function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
}

config.bgs.list = [...Array(config.bgs.size).keys()].map(
  i => `${config.bgs.prefix}${i + 1}${config.bgs.suffix}`
);
shuffle(config.bgs.list);

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
        message: "",
        caller: "req"
      },
      news: {
        show: false,
        content: ""
      },
      panel: [true, true, true],
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
      pagination: {
        // set as this to make sure refresh'll be triggered for both endless scroll and page mode
        page: -1
      },
      loading: false,
      reqlist: [],
      artists: [],
      albums: [],
      lastQuery: {
        query: "",
        size: -1
      }, // for pagination/endless scroll
      bottom: false,
      tlkio: {
        loaded: false,
        cssFile: ""
      },
      player: {
        loaded: false,
        audio5js: {
          playing: false // for vue property tracking problem QQ
        },
        volume: 1
      },
      bg: {
        enable: false,
        index: 0
      }
    };
  },
  created() {
    this.onResize(); // check mobile
    this.showDrawer = !this.isMobile; // don't show by default if mobile
    this.showChat = !this.isMobile; // don't show by default if mobile
    this.startPlayTimer();
    this.getAllInfo(true);
    // sad that computed with getter/setter for sub attr not working QQ
    this.player.volume = this.localStorage.radioNewUIvolume;
    this.bg.enable = this.localStorage.radioNewUIbg;
  },
  mounted() {},
  computed: {
    dark: {
      get() {
        return this.localStorage.radioNewUIdark;
      },
      set(val) {
        this.localStorage.radioNewUIdark = val;
        if (this.showChat) {
          // showChat -> reload tlk.io
          this.initTlkio();
        } else if (this.tlkio.loaded) {
          // !showChat && loaded => mark !loaded
          this.tlkio.loaded = false;
        }
      }
    },
    endlessScroll: {
      get() {
        return this.localStorage.radioNewUIendlessScroll;
      },
      set(val) {
        this.localStorage.radioNewUIendlessScroll = val;
        // refresh list view when mode changed
        this.initPagination();
      }
    },
    bgStyle() {
      return this.bg.enable
        ? `url(${config.bgs.list[this.bg.index]}) !important`
        : "";
    }
  },
  watch: {
    "player.volume"(val) {
      this.localStorage.radioNewUIvolume = val;
      if (this.player.loaded) {
        this.player.audio5js.volume(val);
      }
    },
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
    pagination(newVal, oldVal) {
      if (
        newVal.page !== oldVal.page ||
        newVal.rowsPerPage !== oldVal.rowsPerPage
      ) {
        this.getSonglist(true);
      }
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
      if (showChat && !this.tlkio.loaded) {
        this.tlkio.loaded = true;
        this.initTlkio();
      }
    },
    bottom(bottom) {
      if (bottom && this.endlessScroll) this.getSonglist(true);
    },
    "bg.enable"(val) {
      this.localStorage.radioNewUIbg = val;
    }
  },
  methods: {
    getAllInfo(init) {
      this.getPlaying();
      this.getReqlist();
      this.getArtists();
      this.getAlbums();
      if (init === true) {
        this.initPagination(); // triggers getSonglist @ init stage
      } else {
        this.getSonglist();
      }
    },
    startPlayTimer() {
      this.playTimer = setInterval(() => {
        this.playing.playback_time_seconds = Math.floor(
          (new Date() - this.playing.start) / 1000
        );
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
          this.playing.start =
            new Date() - this.playing.playback_time_seconds * 1000;
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
    initPagination() {
      // clear list for refresh
      // (mainly reset for endless scroll mode)
      // real refresh will triggered by patination update
      this.songlist = [];
      if (this.endlessScroll) {
        this.songlist = [];
        this.lastQuery.size = -1;
        this.pagination = {};
      } else {
        this.pagination = {
          page: 1,
          rowsPerPage: config.append_list_limit, // TODO: make this configurable ?
          totalItems: 0
        };
      }
    },
    getSonglist(query) {
      // query === true => same query, append/page change
      let keep = false;
      if (query === true) {
        keep = true;
        query = this.lastQuery.query;
      } else {
        this.lastQuery.query = query = query || "";
        this.lastQuery.size = -1; // -1 means no query before
      }

      const action = {
        text: "點播",
        act: "request"
      };

      if (this.endlessScroll) {
        // endless scroll mode
        if (keep) {
          // append mode
          query = `start=${this.songlist.length}&${query}`;
        }
        if (
          this.lastQuery.size == -1 ||
          this.songlist.length < this.lastQuery.size
        ) {
          this.loading = true;
          this.$http
            .get(
              `${config.eps.songlist}?limit=${
                config.append_list_limit
              }&${query}`
            )
            .then(response => {
              response.json().then(json => {
                const list = json.songlist.map(song => {
                  song.action = action;
                  return song;
                });
                if (keep) {
                  this.songlist = this.songlist.concat(list);
                } else {
                  this.songlist = list;
                }
                this.lastQuery.size = json.total_size;
                this.loading = false;
              });
            });
        }
      } else {
        // page mode
        const start = (this.pagination.page - 1) * this.pagination.rowsPerPage;
        const limit = this.pagination.rowsPerPage;
        query = `start=${start}&limit=${limit}&${query}`;
        this.loading = true;
        this.$http.get(`${config.eps.songlist}?${query}`).then(response => {
          response.json().then(json => {
            const list = json.songlist.map(song => {
              song.action = action;
              return song;
            });
            this.songlist = list;
            this.pagination.totalItems = this.lastQuery.size = json.total_size;
            this.loading = false;
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
    message(act, song) {
      this.$http
        .post(config.eps.msg, {
          cmd: act,
          list_id: song.list_id,
          song_id: song.song_id
        })
        .then(response => {
          response.json().then(json => {
            this.alert = {
              show: true,
              caller: "req",
              color: json.status,
              message: json.message
            };
            this.getReqlist();
          });
        });
    },
    requestSong(song) {
      this.message("request", song);
    },
    cancelRequest(song) {
      if (song.action.act) {
        this.message("remove", song);
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
      this.tlkio.cssFile = this.dark
        ? config.tlkio.cssDark
        : config.tlkio.cssLight;
      const tlkio = document.getElementById("tlkio");
      while (tlkio.firstChild) {
        tlkio.removeChild(tlkio.firstChild);
      }
      window.initTlkio();
      /*
      const script = document.createElement("script");
      script.setAttribute("src", "//tlk.io/embed.js");
      document.body.appendChild(script);
      */
    },
    initAudio5js(loadingHint) {
      if (loadingHint === true) {
        this.alert = {
          show: true,
          caller: "player",
          color: "info",
          message: "播放器載入中，請稍候⋯⋯"
        };
      }
      return new Promise((success, reject) => {
        const vapp = this;
        this.player.loaded = true;
        window.audio5js = this.player.audio5js = new Audio5js({
          swf_path: config.audio5swf,
          throw_errors: false,
          codecs: ["vorbis", "opus", "mp3"],
          // "this" in this function is pointed to Audio5js, thus we need vapp var
          ready(player) {
            this.on(
              "canplay",
              () => {
                this.volume(vapp.player.volume);
                if (vapp.alert.caller === "player") {
                  vapp.alert.show = false;
                }
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
      if (!this.player.loaded) {
        await this.initAudio5js(true);
      }
      if (this.player.audio5js.playing) {
        this.player.audio5js.pause();
      } else {
        this.player.audio5js.play();
      }
    },
    changeBg() {
      this.bg.index = (this.bg.index + 1) % config.bgs.size;
    }
  }
};
</script>

<style scoped>
.nav-search {
  min-width: 50%;
}
.app-more .v-list__tile__action {
  padding-left: 1em;
}
</style>
