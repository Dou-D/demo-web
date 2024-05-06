import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/saga-blue/theme.css";
import "/node_modules/primeflex/primeflex.css";
import "primeicons/primeicons.css";
import Button from "primevue/button";
import Carousel from "primevue/carousel";
import Tag from "primevue/tag";
import Menubar from "primevue/menubar";
import InputText from "primevue/inputtext";
import Avatar from "primevue/avatar";
import OrderList from "primevue/orderlist";
import Editor from "primevue/editor";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Toolbar from "primevue/toolbar"
import FileUpload from 'primevue/fileupload';
import Image from 'primevue/image';
import Card from 'primevue/card';
import DataView from 'primevue/dataview';
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import Paginator from 'primevue/paginator';
import Rating from 'primevue/rating';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import RadioButton from 'primevue/radiobutton';
import InputNumber from 'primevue/inputnumber';
import ToastService from 'primevue/toastservice';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);
app.use(ToastService);

app.component("TabView", TabView)
app.component("TabPanel", TabPanel)
app.component("DataViewLayoutOptions", DataViewLayoutOptions)
app.component("InputNumber", InputNumber)
app.component("RadioButton", RadioButton)
app.component("Dropdown", Dropdown)
app.component("Textarea", Textarea)
app.component("Rating", Rating)
app.component("Paginator", Paginator)
app.component("Toast", Toast)
app.component("ConfirmDialog", ConfirmDialog)
app.component("Dialog", Dialog)
app.component("DataView", DataView)
app.component("Button", Button);
app.component("Carousel", Carousel);
app.component("Tag", Tag);
app.component("Menubar", Menubar);
app.component("InputText", InputText);
app.component("Avatar", Avatar);
app.component("OrderList", OrderList);
app.component("Editor", Editor);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("Toolbar", Toolbar)
app.component("FileUpload", FileUpload)
app.component("Image", Image)
app.component("Card", Card)
app.mount("#app");

import { SoftwareStore } from "@/stores/software.js";
async function InitSoftwareList() {
    const store = SoftwareStore();
    if (!store.isLoaded) {
        await store.softwareList();
    }
}

InitSoftwareList()