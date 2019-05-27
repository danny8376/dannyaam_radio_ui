<template>
  <v-data-table
    no-data-text="無歌曲"
    :headers="songlistHeaders"
    :items="songlist"
    :hide-actions="true"
    :hide-headers="isMobile"
    :class="{ mobile: isMobile }"
  >
    <template v-slot:items="props">
      <tr v-if="!isMobile" @click.stop="$emit('action', props.item)">
        <td @click.stop="$emit('action', props.item)">{{ props.item.action.text }}</td>
        <td @click.stop="$emit('artist', props.item.artist)">
          {{ props.item.artist }}
        </td>
        <td>{{ props.item.title }}</td>
        <td @click.stop="$emit('album', props.item.album)">
          {{ props.item.album }}
        </td>
        <td>{{ props.item.length }}</td>
      </tr>
      <tr v-else>
        <td @click.stop="$emit('action', props.item)">
          <ul class="flex-content">
            <li
              class="flex-item"
              data-label="操作"
              @click.stop="$emit('action', props.item)"
            >
              {{ props.item.action.text }}
            </li>
            <li
              class="flex-item"
              data-label="歌手"
              @click.stop="$emit('artist', props.item.artist)"
            >
              {{ props.item.artist }}
            </li>
            <li class="flex-item" data-label="曲目">
              {{ props.item.title }}
            </li>
            <li
              class="flex-item"
              data-label="專輯"
              @click.stop="$emit('album', props.item.album)"
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
</template>

<script>
export default {
  props: ["songlist", "isMobile"],
  data() {
    return {
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
    };
  },
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
</style>
