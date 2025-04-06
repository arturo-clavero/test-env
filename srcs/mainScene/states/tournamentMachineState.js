
import { State } from '../../core/stateManager/States';
import { MeshSubState , CssSubState} from '../../core/stateManager/SubStatesExtends';

import { screenMaterial } from '../objects/simpleAssets';
import { screenSurface, center, object, partIndex, surfaceIndex } from '../objects/machines/tournamentMachineObj';
import { scene1 } from '../overlays/scenes/scene1';
import { fakeGame } from '../overlays/scenes/fakeGame';
import { End } from '../overlays/divs/end';
import {start} from '../overlays/divs/tour_start';

import {create} from '../overlays/divs/tour_create';
import {join} from '../overlays/divs/tour_join';


const divStart = start;
const restScreen = new CssSubState(
	"rest create",
	object,
	partIndex,
	surfaceIndex,
	divStart["div"],
	0,
	()=>{
		divStart['show-div']();
		divStart['hide-buttons']();
	},
	null,
	()=>{
		divStart['hide-div']();
	},
	()=>{divStart["resize"]()},
	null,
	null,
)

const startScreen = new CssSubState(
	"start create",
	object,
	partIndex,
	surfaceIndex,
	divStart['div'],
	0,
	()=>{
		divStart['show-div']();
		divStart['hide-buttons']();
	},
	()=>{
		divStart['show-buttons']();
	},
	()=>{
		divStart['hide-div']();
		divStart['hide-buttons']();
	},
	()=>{divStart["resize"]()},
	null,
	null,
)


const divCreate = create;
const restScreenCreate = new CssSubState(
	"rest create",
	object,
	partIndex,
	surfaceIndex,
	divCreate["div"],
	0,
	()=>{
		divCreate['show-div']();
		divCreate['hide-buttons']();
	},
	null,
	()=>{
		divCreate['hide-div']();
	},
	()=>{divCreate["resize"]()},
	null,
	null,
)

const startScreenCreate = new CssSubState(
	"start create",
	object,
	partIndex,
	surfaceIndex,
	divCreate['div'],
	0,
	()=>{
		divCreate['show-div']();
		divCreate['hide-buttons']();
	},
	()=>{
		divCreate['show-buttons']();
	},
	()=>{
		divCreate['hide-div']();
		divCreate['hide-buttons']();
	},
	()=>{divCreate["resize"]()},
	null,
	null,
)

const divJoin = join;
const restScreenJoin = new CssSubState(
	"rest join",
	object,
	partIndex,
	surfaceIndex,
	divJoin["div"],
	0,
	()=>{
		divJoin['show-div']();
		divJoin['hide-buttons']();
	},
	null,
	()=>{
		divJoin['hide-div']();
		divJoin['hide-buttons']();
	},
	()=>{divJoin["resize"]()},
	null,
	null,
)

const startScreenJoin = new CssSubState(
	"start join",
	object,
	partIndex,
	surfaceIndex,
	divJoin['div'],
	0,
	()=>{
		divJoin['show-div']();
		divJoin['hide-buttons']();
	},
	()=>{
		console.log("specific");
		divJoin['show-buttons']();
	},
	()=>{
		divJoin['hide-div']();
		divJoin['hide-buttons']();
	},
	()=>{divJoin["resize"]()},
	null,
	null,
)

const tourMachineState = new State(
	"tour game screen", 
	{
		pos: [center.x,center.y,center.z],
		duration: 2,
		ease: "power2.inOut"
	}, 
	[
		restScreen, 
		startScreen,
		restScreenCreate,
		startScreenCreate,
		restScreenJoin,
		startScreenJoin,
	],
	(self)=>{
		self.changeSubstate();
	},
	(self)=>{
		if (self.currentSubstateIndex != 2)
		{
			self.currentSubstate.exit();
			self.changeSubstate(0);
		}
	},
	[
		screenMaterial,
	],

)

export { tourMachineState}