<template>
  <div>
    <Toast position="top-left" />

    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button class="mr-2" icon="pi pi-plus" label="New" severity="success" @click="openNew" />
        </template>
      </Toolbar>
      <!-- 软件列表 -->
      <DataTable ref="dt" v-model:selection="selectedProducts" :paginator="true" :rows="5" :filters="filters"
        :rowsPerPageOptions="[10, 20, 30]" :value="products"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" dataKey="id"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown">

        <template #header>
          <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 class="m-0">Manage Products</h4>
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="example_name" />
            </span>
          </div>
        </template>
        <!-- 每一列 -->
        <Column :exportable="false" selectionMode="multiple" style="width: 3rem"></Column>
        <Column field="ImgPath" header="image">

          <template #body="slotProps">
            <img :src="'/' + slotProps.data.BucketName + '/' + slotProps.data.ImagePath" :alt="slotProps.data.ImagePath"
              class="border-round" style="width: 3rem" />
          </template>
        </Column>
        <Column field="ID" header="ID" sortable style="min-width:12rem"></Column>
        <Column field="Name" header="Name" style="min-width:16rem"></Column>
        <Column field="Info" header="Info" style="min-width:16rem">

          <template #body="slotProps">
            <!-- 使用 v-html 指令来渲染后端返回的 HTML 内容 -->
            <div v-html="slotProps.data.Info"></div>
          </template>
        </Column>

        <Column :exportable="false" style="min-width:8rem">
          <!-- 编辑软件 -->

          <template #body="slotProps">
            <Button label="Edit" severity="secondary" @click="editProductButton(slotProps.data)" style="margin-right: 5px;" />
            <Button label="Delete" severity="danger" @click="deleteProductButton(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- 新增软件弹出框 -->
    <Dialog v-model:visible="productDialog" :modal="true" :style="{ width: '90%' }" :value="products" class="p-fluid"
      header="Product Details">
      <div class="field">
        <!-- 名字 -->
        <label for="name">Name</label>
        <InputText ref="name" v-model.trim="product.name" :class="{ 'p-invalid': submitted && !product.name }" autofocus
          required="true" />
        <small v-if="submitted && !product.name" class="p-error">Name is required.</small>
      </div>

      <!-- file -->
      <div v-if="!editted" class="card">
        <label>上传软件</label>
        <FileUpload accept=".zip" customUpload mode="basic" name="demo[]" @select="onSelectedFiles">
        </FileUpload>
      </div>
      <!-- 封面 -->
      <div v-if="!editted" class="field">
        <label>上传图片</label>
        <FileUpload accept="image/*" customUpload mode="basic" name="demo[]" @select="onSelectedImages">
        </FileUpload>
      </div>
      <!-- software info -->
      <div class="field">
        <label for="info">INFO</label>
        <InfoRadioButton :name="product.info" @BindRadioInfo="GetRadioInfo" />
      </div>
      <!-- 软件内容 -->
      <div class="field">
        <label for="description">Description</label>
        <Editor v-if="!editted" id="description" v-model="product.content" editorStyle="height: 320px" />
        <p v-if="editted" v-html="product.content"></p>
      </div>
      <!-- 取消/保存设定 -->

      <template #footer>
        <Button icon="pi pi-times" label="Cancel" text @click="hideDialog" />
        <!-- 上传save -->
        <Button v-if="!editted" icon="pi pi-check" label="Save" text @click="saveProduct" />
        <!-- 编辑save -->
        <Button v-if="editted" icon="pi pi-check" label="Edit" text @click="EditProduct" />
      </template>
    </Dialog>
    <!-- 删除软件弹出框 -->
    <Dialog v-model:visible="deleteProductsDialog" :modal="true" :style="{ width: '450px' }" header="Confirm">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
      </div>

      <template #footer>
        <Button icon="pi pi-times" label="No" text @click="deleteProductsDialog = false" />
        <Button icon="pi pi-check" label="Yes" text @click="confirmDeleteSelected" />
      </template>
    </Dialog>

  </div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import { SoftwareStore } from '@/stores/software';
import InfoRadioButton from '@/components/inforadiobutton.vue'
export default {
  name: "Manage",
  emits: ['select'],
  components: { InfoRadioButton },
  data() {
    return {
      /**
       * @products software list
       * @productDialog open or close dialog
       * @product software detail
       * @selectedProducts checkbox
       * @submitted when it is true, you can upload software
       * @deleteProductsDialog Delete the software you selected
       */
      products: [],
      // true-open dialog||false-close dialog
      productDialog: false,
      deleteProductsDialog: false,
      // 展开dialog的数据保存在product
      product: {
        id: '',
        name: '',
        info: '',
        content: '',
        img: null,
        apk: null
      },
      selectedProducts: null,
      // 搜索框过滤
      filters: {},
      submitted: false,
      editted: false
    }
  },
  created() {
    this.InitSoftwareList()
    // 初始化搜索过滤器
    this.initFilters();
  },
  methods: {
    // info单选框传值
    GetRadioInfo(newValue) {
      console.log(newValue);
      this.product.info = newValue
    },
    async InitSoftwareList() {
      const useSoftwareStore = SoftwareStore()
      if (!useSoftwareStore.isLoaded) {
        await useSoftwareStore.softwareList();
      }
      console.log("this.products", this.products)
      this.products = useSoftwareStore.SoftwareArrays
    },
    // 打开新增/编辑dialog
    openNew() {
      this.product = {
        name: '',
        formFile: null,
        formImage: null,
        info: '',
        content: ''
      };
      this.submitted = false;
      this.productDialog = true;
    },
    // 关闭新增/编辑dialog
    hideDialog() {
      this.product = {
        name: '',
        formFile: null,
        formImage: null,
        info: '',
        content: ''
      };
      this.productDialog = false;
      this.submitted = false;
      this.editted = false
    },
    onSelectedFiles(event) {
      console.log("file event", event);
      this.product.apk = event.files[0]
    },
    onSelectedImages(event) {
      console.log("image event", event);
      this.product.img = event.files[0]
    },
    saveProduct() {
      // name为空无法提交
      if (this.product.name) {
        // 可以上传了
        this.submitted = true;
        this.uploadProduct()
      }
    },
    async uploadProduct() {
      if (!this.submitted) return
      const useSoftwareStore = SoftwareStore()
      this.productDialog = false;
      this.submitted = false
      const AddRes = await useSoftwareStore.softwareAdd(this.product)
      this.product = {
        name: '',
        info: '',
        content: '',
        img: null,
        apk: null
      };
      if (AddRes.data.code != 200) {
        console.log("softwareadd err", AddRes);
        this.$toast.add({ severity: 'error', summary: AddRes.data.msg, life: 3000 });
        return
      }
      this.$toast.add({ severity: 'success', summary: AddRes.data.msg, detail: AddRes.data.data, life: 3000 });
      console.log("manage upload software", AddRes);
      if (!useSoftwareStore.isLoaded) {
        await useSoftwareStore.softwareList();
      }
      this.products = useSoftwareStore.SoftwareArrays
    },
    // edit dialog
    editProductButton(product) {
      this.productDialog = true;
      this.product = {
        content: product.Content,
        info: product.Info,
        name: product.Name,
        id: product.ID
      }
      console.log("product", this.product);
      this.editted = true
    },
    async EditProduct() {
      if (this.product.name) {
        console.log("edit", this.product);
        const useSoftwareStore = SoftwareStore()
        const editRes = await useSoftwareStore.softwareEdit(
          {
            name: this.product.name,
            info: this.product.info,
            content: this.product.content,
            id: this.product.id
          })
        if (editRes.data.code != 200) {
          console.log("edit err", editRes);
          this.$toast.add({ severity: 'error', summary: editRes.data.msg, life: 3000 });
          return
        }
        this.product = {
          id: '',
          name: '',
          info: '',
          content: '',
          img: null,
          apk: null
        }
        this.productDialog = false;
        this.editted = false
        if (!useSoftwareStore.isLoaded) {
          await useSoftwareStore.softwareList();
        }
        this.products = useSoftwareStore.SoftwareArrays
      }
    },
    deleteProductButton(product) {
      this.product = { ...product };
      this.deleteProductsDialog = true;
    },
    async confirmDeleteSelected() {
      const useSoftwareStore = SoftwareStore()
      const delRes = await useSoftwareStore.softwareDel({ ID: this.product.ID })
      if (delRes.data.code != 200) {
        console.log("del err", delRes);
        this.$toast.add({ severity: 'error', summary: delRes.data.msg, life: 3000 });
        return
      }
      this.$toast.add({ severity: 'success', summary: delRes.data.msg, detail: delRes.data.data, life: 3000 });
      this.deleteProductsDialog = false;
      this.selectedProducts = null;
      if (!useSoftwareStore.isLoaded) {
        await useSoftwareStore.softwareList();
      }
      this.products = useSoftwareStore.SoftwareArrays
    },
    initFilters() {
      this.filters = {
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
      }
    },
  }
}
</script>