<template>
  <div>
    <v-toolbar flat color="white">
      <v-text-field
        v-model="search"
        append-icon="search"
        :label="`搜尋${name}`"
        single-line
        hide-details
        clearable
      ></v-text-field>
    </v-toolbar>
    <v-data-table
      :items="list"
      :headers="headers"
      :hide-headers="true"
      :search="search"
      :pagination.sync="pagination"
    >
      <template v-slot:items="props">
        <td @click.stop="$emit('action', props.item.value)">
          {{ props.item.text }}
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
