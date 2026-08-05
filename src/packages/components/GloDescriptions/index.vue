<template>
  <div class="flex w-full justify-between">
    <div class="info-con w-full">
      <ul
        v-for="(colItem, colIndex) in desArr"
        :key="colIndex"
        class="info-col"
      >
        <li
          v-for="(rowItem, rowIndex) in colItem"
          :key="rowIndex"
          class="info-row"
          :style="{alignItems: getRowAlignItem(rowItem.align)}"
        >
          <slot
            v-if="rowItem.slotRow"
            :name="rowItem.slotRow"
            v-bind="rowItem"
          ></slot>
          <template v-else>
            <span
              class="row-title"
              :style="{width: rowTitleWidth}"
            >
              {{ rowItem.title }}
            </span>
            <span class="row-con">
              <slot
                v-if="rowItem.slotCon"
                :name="rowItem.slotCon"
                v-bind="rowItem"
              ></slot>
              <span v-else-if="rowItem.dictName">
                {{ showEmpty(getDictLabel(rowItem.dictName, rowItem.content), rowItem.emptyStr ?? emptyStr) }}
              </span>
              <span v-else>{{ showEmpty(rowItem.content, rowItem.emptyStr ?? emptyStr) }}</span>
            </span>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getDictLabel} from '../../hooks/dict';
import {showEmpty} from '../../utils/display';
import type {GloDescriptionsProps} from './type';

withDefaults(defineProps<GloDescriptionsProps>(), {
  desArr: () => [],
  rowTitleWidth: '160px',
  emptyStr: '-'
});

function getRowAlignItem(cssStr?: string): string {
  return cssStr ? cssStr : 'center';
}
</script>

<style lang="scss" scoped>
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
.info-con {
  display: flex;
  justify-content: space-between;
  font-family: Source Han Sans;
  font-size: 14px;
  .info-col {
    flex: 1;
    .info-row {
      display: flex;
      align-items: center;
      margin-bottom: 22px;
    }
  }
  .row-title {
    font-weight: 400;
    color: #666a70;
    text-align: right;
  }
  .row-con {
    flex: 1;
    font-weight: normal;
    display: flex;
    align-items: center;
    letter-spacing: 0px;
    color: #363b45;
  }
}
</style>
