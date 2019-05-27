<template>
  <v-card tile flat>
    <v-card-title
      ><span class="title">播放中</span>
      <v-container fluid grid-list-md class="text-xs-center">
        <v-layout row wrap>
          <v-flex d-flex xs6 sm2 md2 order-xs1 order-sm1>
            <!-- lazy-src is from broken_image @ Material Design Icons -->
            <v-img
              :src="albumart"
              lazy-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAACAklEQVR4Ae3bMU4CURQFUDoS4w40QEFHgsx7OxO3AEvQNRAWofSAWxgTOymgFhhDcTvxZf5Nhq/e+xsTvP9xEoCZCdNSFEVRFEVRzmd4W9zbwjdeNbw29uLj4W2LyeDaZnbw6nLLDjbzq1Za+m1benX5Zct+Owngj15lsp5Snn7H99kAPotubYBNvMpn2aQ2wFc5AXxdH7DNCrCtD6jyWgIIIEAUAQQQQAABBBDASivxN99vHGDlqDfqpRHQL7r2fgEAxp+aqQT0QWgYgPEgMH0QKICVaeNBIPogEABskTgeBKKP+emAgBCMB4HpYz4ABCFlPAhEH/MBIAhJ40Eg+pgPAEFIGg8C0cd8AAhC0ngQkvuYDwBNCMafvokDQs0+5lMAEOLxVloZEIK+v93dfPcICQAhGh8/Gv8HCOkJCMF4EkgTkHOvRfYlEvdJAoItmDcp06cJ2IL7mGT6JAFbsF9UTJ8ixFvwhwpxnyDEW/AHa3GfIERb8IfLcZ8iRFuwJyxxnySc2YI4ZeT6LAAE6qSd6fMAEMjLJug3DgCBvXCFfgOABi4d/tGLuwIIIIAAAggggAACCLDLCrCrD1hnBXitDSimOQGK6e/++f3eO//pBgik387kJ/irfjv5JiCf2/GST96OPh9ck7dh+dgW/tH8bVj+7A8/3YalKIqiKIqifAEiv15UaSpUPAAAAABJRU5ErkJggg=="
              max-height="128"
              max-width="128"
              contain
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
              :size="112"
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
      }
    };
  },
  watch: {
    "playing.playback_time_seconds"() {
      this.playProgress.percent =
        (this.playing.playback_time_seconds * 100) /
        this.playing.length_seconds;
      const min = Math.floor(this.playing.playback_time_seconds / 60);
      const sec = this.playing.playback_time_seconds % 60;
      const minS = this.playing.length.indexOf(":") ? `${min}:` : "";
      const secS = minS.length && sec < 10 ? `0${sec}` : sec;
      this.playProgress.text = `${minS}${secS}`;
    }
  }
};
</script>

<style scoped>
.center-inside-block {
  margin: auto;
}
</style>
