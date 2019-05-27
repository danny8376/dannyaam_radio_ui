<template>
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
                <v-card flat tile @click.stop="$emit('artist', playing.artist)">
                  <v-card-title primary-title>
                    <div class="center-inside-block">
                      <div class="caption">歌手</div>
                      <div class="body-2">{{ playing.artist }}</div>
                    </div>
                  </v-card-title>
                </v-card>
              </v-flex>
              <v-flex d-flex xs6>
                <v-card flat tile @click.stop="$emit('album', playing.album)">
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
</template>

<script>
export default {
  props: ["playing", "albumart"],
  data() {
    return {
      playProgress: {
        percent: 0,
        text: ""
      },
    };
  },
  computed: {
    playback_time() {
      return this.playing.playback_time_seconds;
    },
  },
  watch: {
    playback_time(playback_time) {
      this.playProgress.percent =
        (this.playing.playback_time_seconds * 100) /
        this.playing.length_seconds;
      const min = Math.floor(this.playing.playback_time_seconds / 60);
      const sec = this.playing.playback_time_seconds % 60;
      const minS = this.playing.length.indexOf(":") ? `${min}:` : "";
      const secS = minS.length && sec < 10 ? `0${sec}` : sec
      this.playProgress.text = `${minS}${secS}`;
    },
  },
};
</script>

<style scoped>
</style>
