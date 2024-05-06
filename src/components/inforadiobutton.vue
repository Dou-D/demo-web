<template>
    <div class="flex flex-wrap gap-3">
        <div class="flex align-items-center">
            <RadioButton @change="getRadioValue" v-model="ingredient" inputId="ingredient1" name="IDE" value="IDE" />
            <label for="ingredient1" class="ml-2">IDE</label>
        </div>
        <div class="flex align-items-center">
            <RadioButton @change="getRadioValue" v-model="ingredient" inputId="ingredient2" name="信息" value="信息" />
            <label for="ingredient2" class="ml-2">信息</label>
        </div>
        <div class="flex align-items-center">
            <RadioButton @change="getRadioValue" v-model="ingredient" inputId="ingredient3" name="电气" value="电气" />
            <label for="ingredient3" class="ml-2">电气</label>
        </div>
    </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
let ingredient = ref('');
console.log("ingredient", ingredient)
const emit = defineEmits(['BindRadioInfo'])
function getRadioValue() {
  emit('BindRadioInfo', ingredient.value);
}

const props = defineProps(['name'])
watchEffect(() => {
  if (props.name) {
    console.log("props.name", props.name)
    ingredient.value = props.name;
    console.log("ingredient.value", ingredient.value)
  }
});
</script>