<template>
  <div>
    <v-container>
      <v-text-field
        v-model="search"
        append-icon="search"
        :label="`搜尋${name}`"
        single-line
        hide-details
        clearable
      ></v-text-field>
    </v-container>
    <v-data-table
      :items="list"
      :headers="headers"
      :hide-headers="true"
      :search="search"
      :pagination.sync="pagination"
    >
      <template #items="{ item }">
        <td @click.stop="$emit('action', item.value)">
          {{ item.text }}
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: ["name", "list"],
  data() {
    return {
      headers: [
        {
          text: "Text",
          value: "text",
          sortable: false
        }
      ],
      pagination: {
        rowsPerPage: 10
      },
      search: ""
    };
  }
};
</script>

<style scoped></style>
