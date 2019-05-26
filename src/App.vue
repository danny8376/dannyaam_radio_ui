<template>
  <v-app>
    <v-toolbar app clipped-left>
      <v-toolbar-side-icon
        @click.stop="showDrawer = !showDrawer"
      ></v-toolbar-side-icon>
      <v-toolbar-title>
        <span>DannyAAM's Radio</span>
        <span>&nbsp;</span>
        <span class="font-weight-light caption">{{ playing.titleShow }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="showSearch = !showSearch">
        <v-icon>search</v-icon>
      </v-btn>
      <v-expand-x-transition>
        <v-text-field
          v-model="search"
          v-show="showSearch"
          placeholder="搜尋歌曲(使用foobar2000搜尋格式)"
          solo
          clearable
          hide-details
          single-line
          class="nav-search"
        >
        </v-text-field>
      </v-expand-x-transition>
      <v-btn icon @click.stop="getAllInfo">
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-menu bottom left>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>person</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>會員功能</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
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
          <v-toolbar flat color="white">
            <v-text-field
              v-model="searchArtists"
              append-icon="search"
              label="搜尋歌手"
              single-line
              hide-details
            ></v-text-field>
          </v-toolbar>
          <v-data-table
            :items="artists"
            :headers="[{ text: 'text', value: 'text' }]"
            :hide-headers="true"
            :search="searchArtists"
            :pagination.sync="artAlbumPagination"
          >
            <template v-slot:items="props">
              <td @click.stop="searchArtist(props.item.text)">
                {{ props.item.text }}
              </td>
            </template>
          </v-data-table>
        </v-tab-item>
        <v-tab-item :key="1">
          <v-toolbar flat color="white">
            <v-text-field
              v-model="searchAlbums"
              append-icon="search"
              label="搜尋專輯"
              single-line
              hide-details
            ></v-text-field>
          </v-toolbar>
          <v-data-table
            :items="albums"
            :headers="[{ text: 'text', value: 'text' }]"
            :hide-headers="true"
            :search="searchAlbums"
            :pagination.sync="artAlbumPagination"
          >
            <template v-slot:items="props">
              <td @click.stop="searchAlbum(props.item.text)">
                {{ props.item.text }}
              </td>
            </template>
          </v-data-table>
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
      <v-card tile flat>
        <v-card-title
          ><span class="title">播放中</span>
          <v-container fluid grid-list-md class="text-xs-center">
            <v-layout row wrap>
              <v-flex d-flex xs6 sm2 md2 order-xs1 order-sm1>
                <v-img
                  :src="albumart"
                  max-height="128"
                  max-width="128"
                  class="center-inside-block"
                ></v-img>
              </v-flex>
              <v-flex d-flex xs12 sm8 md8 order-xs3 order-sm2>
                <v-layout row wrap>
                  <v-flex d-flex xs12>
                    <span class="headline">{{ playing.title }}</span>
                  </v-flex>
                  <v-flex d-flex xs6>
                    <v-card
                      flat
                      tile
                      @click.stop="searchArtist(playing.artist)"
                    >
                      <v-card-title primary-title>
                        <div class="center-inside-block">
                          <div class="caption">歌手</div>
                          <div class="body-2">{{ playing.artist }}</div>
                        </div>
                      </v-card-title>
                    </v-card>
                  </v-flex>
                  <v-flex d-flex xs6>
                    <v-card flat tile @click.stop="searchAlbum(playing.album)">
                      <v-card-title primary-title>
                        <div class="center-inside-block">
                          <div class="caption">專輯</div>
                          <div class="body-2">{{ playing.album }}</div>
                        </div>
                      </v-card-title>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex d-flex xs6 sm2 md2 order-xs2 order-sm3>
                <v-progress-circular
                  :rotate="360"
                  :size="96"
                  :width="8"
                  color="teal"
                  v-model="playProgress.percent"
                  class="center-inside-block"
                >
                  <div>{{ playProgress.text }}</div>
                  <div>{{ playing.length }}</div>
                </v-progress-circular>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-title>
      </v-card>
      <v-expansion-panel v-model="panel" expand>
        <v-expansion-panel-content :key="0">
          <template v-slot:header>
            <div class="title">
              點播清單
            </div>
          </template>
          <v-data-table
            :headers="songlistHeaders"
            :items="reqlist"
            :hide-actions="true"
            :hide-headers="isMobile"
            :class="{ mobile: isMobile }"
          >
            <template v-slot:items="props">
              <tr v-if="!isMobile">
                <td @click.stop="searchArtist(props.item.artist)">
                  {{ props.item.artist }}
                </td>
                <td>{{ props.item.title }}</td>
                <td @click.stop="searchAlbum(props.item.album)">
                  {{ props.item.album }}
                </td>
                <td>{{ props.item.length }}</td>
              </tr>
              <tr v-else>
                <td>
                  <ul class="flex-content">
                    <li
                      class="flex-item"
                      data-label="歌手"
                      @click.stop="searchArtist(props.item.artist)"
                    >
                      {{ props.item.artist }}
                    </li>
                    <li class="flex-item" data-label="曲目">
                      {{ props.item.title }}
                    </li>
                    <li
                      class="flex-item"
                      data-label="專輯"
                      @click.stop="searchAlbum(props.item.album)"
                    >
                      {{ props.item.album }}
                    </li>
                    <li class="flex-item" data-label="長度">
                      {{ props.item.length }}
                    </li>
                  </ul>
                </td>
              </tr>
            </template>
          </v-data-table>
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
      <v-data-table
        :headers="songlistHeaders"
        :items="songlist"
        :hide-actions="true"
        :hide-headers="isMobile"
        :class="{ mobile: isMobile }"
      >
        <template v-slot:items="props">
          <tr v-if="!isMobile" @click.stop="requestSong(props.item)">
            <td @click.stop="requestSong(props.item)">點播</td>
            <td @click.stop="searchArtist(props.item.artist)">
              {{ props.item.artist }}
            </td>
            <td>{{ props.item.title }}</td>
            <td @click.stop="searchAlbum(props.item.album)">
              {{ props.item.album }}
            </td>
            <td>{{ props.item.length }}</td>
          </tr>
          <tr v-else>
            <td @click.stop="requestSong(props.item)">
              <ul class="flex-content">
                <li
                  class="flex-item"
                  data-label="動作"
                  @click.stop="requestSong(props.item)"
                >
                  點播
                </li>
                <li
                  class="flex-item"
                  data-label="歌手"
                  @click.stop="searchArtist(props.item.artist)"
                >
                  {{ props.item.artist }}
                </li>
                <li class="flex-item" data-label="曲目">
                  {{ props.item.title }}
                </li>
                <li
                  class="flex-item"
                  data-label="專輯"
                  @click.stop="searchAlbum(props.item.album)"
                >
                  {{ props.item.album }}
                </li>
                <li class="flex-item" data-label="長度">
                  {{ props.item.length }}
                </li>
              </ul>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-content>
  </v-app>
</template>

<script>
//import HelloWorld from "./components/HelloWorld";

const config = {
  eps: {
    playing: "http://live.saru.moe/music/songctl2/data/playing.php",
    songlist: "http://live.saru.moe/music/songctl2/data/songlist.php",
    reqlist: "http://live.saru.moe/music/songctl2/data/requestlist.php",
    albums: "http://live.saru.moe/music/songctl2/data/albumlist.php",
    artists: "http://live.saru.moe/music/songctl2/data/artistlist.php",
    albumart: "http://live.saru.moe/music/songctl2/data/albumart.php",
    msg: "http://live.saru.moe/music/songctl2/data/message.php"
  },
  list_limit: 50
};

export default {
  name: "App",
  components: {
    //HelloWorld,
  },
  data() {
    return {
      isMobile: false,
      showDrawer: true,
      showSearch: false,
      panel: [true],
      artAlbumTab: 0,
      artAlbumPagination: {
        rowsPerPage: 10
      },
      searchArtists: "",
      searchAlbums: "",
      showChat: true,
      search: "",
      playing: {},
      playProgress: {
        percent: 0,
        text: ""
      },
      playTimer: 0,
      albumart: "",
      songlistTitle: "",
      songlistHeaders: [
        {
          text: "動作",
          align: "center",
          sortable: false,
          width: "5%"
        },
        {
          text: "歌手",
          align: "center",
          sortable: false,
          value: "artist",
          width: "25%"
        },
        {
          text: "曲目",
          align: "center",
          sortable: false,
          value: "title",
          width: "40%"
        },
        {
          text: "專輯",
          align: "center",
          sortable: false,
          value: "album",
          width: "25%"
        },
        {
          text: "長度",
          align: "center",
          sortable: false,
          value: "length",
          width: "5%"
        }
      ],
      songlist: [],
      reqlist: [],
      artists: [],
      albums: [],
      lastQuery: "", // for endless scroll
      bottom: false
    };
  },
  created() {
    this.onResize(); // check mobile
    this.showDrawer = !this.isMobile; // don't show by default if mobile
    this.showChat = !this.isMobile; // don't show by default if mobile
    window.addEventListener("scroll", () => {
      this.bottom = this.bottomVisible();
    });
    this.startPlayTimer();
    this.getAllInfo();
    this.tlkio();
  },
  mounted() {},
  watch: {
    playing(playing) {
      playing.titleShow = `${playing.title} - ${playing.artist}`;
      document.title = `[ ${playing.titleShow} ] - DannyAAM's Radio`;
      this.albumart = `${config.eps.albumart}?_=${new Date().getTime()}`;
      this.updatePlayProgress();
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
        this.updatePlayProgress();
        if (this.playing.playback_time_seconds >= this.playing.length_seconds) {
          this.getPlaying();
          this.getReqlist();
        }
      }, 1000);
    },
    updatePlayProgress() {
      this.playProgress.percent =
        (this.playing.playback_time_seconds * 100) /
        this.playing.length_seconds;
      const min = Math.floor(this.playing.playback_time_seconds / 60);
      const sec = this.playing.playback_time_seconds % 60;
      const minS = this.playing.length.indexOf(":") ? `${min}:` : "";
      this.playProgress.text = `${minS}${sec}`;
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
            return {
              text: text
            };
          });
        });
      });
    },
    getAlbums() {
      this.$http.get(config.eps.albums).then(response => {
        response.json().then(json => {
          this.albums = json.map(text => {
            return {
              text: text
            };
          });
        });
      });
    },
    getReqlist() {
      this.$http.get(config.eps.reqlist).then(response => {
        response.json().then(json => {
          this.reqlist = json.requestlist.slice(0, -1);
        });
      });
    },
    getSonglist(query) {
      // query === true => append mode
      let append = false;
      if (query === true) {
        append = true;
        query = `start=${this.songlist.length}&${this.lastQuery}`;
      } else {
        this.lastQuery = query = query || "";
      }
      this.$http
        .get(`${config.eps.songlist}?limit=${config.list_limit}&${query}`)
        .then(response => {
          response.json().then(json => {
            if (append) {
              this.songlist = this.songlist.concat(json.songlist.slice(0, -1));
            } else {
              this.songlist = json.songlist.slice(0, -1);
            }
          });
        });
    },
    searchArtist(art) {
      this.getSonglist(`artist=${encodeURIComponent(art)}`);
      this.songlistTitle = "歌手：" + art;
    },
    searchAlbum(album) {
      this.getSonglist(`album=${encodeURIComponent(album)}`);
      this.songlistTitle = "專輯：" + album;
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
            console.log(json.message);
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
    tlkio() {
      const script = document.createElement("script");
      script.setAttribute("src", "//tlk.io/embed.js");
      document.body.appendChild(script);
    }
  }
};
</script>

<style scoped>
.mobile {
  color: #333;
}

@media screen and (max-width: 768px) {
  .mobile table.v-table tr {
    max-width: 100%;
    position: relative;
    display: block;
  }

  .mobile table.v-table tr:nth-child(odd) {
    border-left: 6px solid gray;
  }

  .mobile table.v-table tr:nth-child(even) {
    border-left: 6px solid cyan;
  }

  .mobile table.v-table tr td {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #f5f5f5;
    height: auto;
    padding: 10px;
  }

  .mobile table.v-table tr td ul li:before {
    content: attr(data-label);
    padding-right: 0.5em;
    text-align: left;
    display: block;
    color: #999;
  }
  .v-datatable__actions__select {
    width: 50%;
    margin: 0px;
    justify-content: flex-start;
  }
  .mobile .theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
    background: transparent;
  }
}
.flex-content {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.flex-item {
  padding: 5px;
  width: 50%;
  height: 40px;
  font-weight: bold;
}

.nav-search {
  min-width: 50%;
}

.center-inside-block {
  margin: auto;
}
</style>
