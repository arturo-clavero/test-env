import { preEnterScene } from "./src/index.js";
import { Socket } from "./src/mainScene/utils/Socket.js";


//uponEnter()
// export function onMounted(){
	const value = "fake"
	const container = document.getElementById('app-container');
	preEnterScene(container);
	new Socket().init_scene(value)
// }


// // App.vue
// import { preEnterScene, uponEnter } from "./src/index.js";

// onMounted(() => {
// 	const container = document.getElementById('app-container');
// 	preEnterScene(container);
// new Socket().init_scene(showMainApp.value)

//   });
// });