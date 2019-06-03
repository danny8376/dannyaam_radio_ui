<template>
  <v-data-table
    no-data-text="無歌曲"
    :headers="songlistHeaders"
    :items="songlist"
    :pagination="pagination"
    @update:pagination="updatePagination"
    :loading="loading"
    :rows-per-page-items="[5, 10, 25, 50, 75, 100]"
    :total-items="totalItems"
    :hide-actions="!hasPagination"
    :hide-headers="isMobile"
    :class="{ mobile: isMobile }"
  >
    <template #items="{ item }">
      <tr v-if="!isMobile">
        <td>
          <v-btn
            small
            flat
            class="inline-btn"
            @click.stop="$emit('action', item)"
          >
            {{ item.action.text }}
          </v-btn>
        </td>
        <td @click.stop="$emit('artist', item.artist)">
          {{ item.artist }}
        </td>
        <td @click.stop="$emit('action', item)">
          {{ item.title }}
        </td>
        <td @click.stop="$emit('album', item.album)">
          {{ item.album }}
        </td>
        <td>{{ item.length }}</td>
      </tr>
      <tr v-else>
        <td>
          <ul class="flex-content">
            <li
              class="flex-title"
              data-label="曲目"
              @click.stop="$emit('action', item)"
            >
              <span class="title">
                {{ item.title }}
              </span>
            </li>
            <li
              class="flex-item"
              data-label="歌手"
              @click.stop="$emit('artist', item.artist)"
            >
              {{ item.artist }}
            </li>
            <li
              class="flex-item"
              data-label="專輯"
              @click.stop="$emit('album', item.album)"
            >
              {{ item.album }}
            </li>
            <li class="flex-item" data-label="長度">
              {{ item.length }}
            </li>
            <li class="flex-action" data-label="操作">
              <v-btn small flat @click.stop="$emit('artist', item.artist)">
                找同歌手
              </v-btn>
              <v-btn small flat @click.stop="$emit('album', item.album)">
                找同專輯
              </v-btn>
              <v-btn small flat @click.stop="$emit('action', item)">
                {{ item.action.text }}
              </v-btn>
            </li>
          </ul>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: ["songlist", "pagination", "loading", "isMobile"],
  data() {
    return {
      songlistHeaders: [
        {
          text: "操作",
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
      ]
    };
  },
  computed: {
    hasPagination() {
      const pagination = this.pagination || {};
      return Object.keys(pagination).length > 0;
    },
    totalItems() {
      if (this.hasPagination) {
        return this.pagination.totalItems;
      } else {
        return null; // internal default value => use internal pagination
      }
    }
  },
  methods: {
    updatePagination(val) {
      // don't trigger parent update if pagination isn't enabled
      this.$emit("update:pagination", this.hasPagination ? val : {});
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

.flex-title {
  padding: 5px;
  width: 100%;
  overflow: hidden;
  font-weight: bold;
}

.flex-item {
  padding: 5px;
  min-width: 33%;
  height: 40px;
  overflow: hidden;
  font-weight: bold;
}

.flex-action {
  padding: 5px;
  width: 100%;
}

.inline-btn {
  min-width: 0;
}
</style>
