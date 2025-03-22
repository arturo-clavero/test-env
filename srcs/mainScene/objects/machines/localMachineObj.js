import { Object } from '../../../core/objectFactory/Object'
import { materialsgroup, singleMaterial, 
		part_sym_2d, part_sym_3d, 
		part_asym, part_asym_ang,
		threeCube} from '../../../experiments/prev/simpleAssets';

import { State } from '../../../core/stateManager/States';
import { MeshSubState , CssSubState} from '../../../core/stateManager/SubStatesExtends';
import { StateManager } from '../../../core/stateManager/StateManager';
import { SubState } from '../../../core/stateManager/SubStates';

import { start } from '../../overlays/divs/start'
import { form1 } from '../../overlays/divs/form1';
import { scene1 } from '../../overlays/scenes/scene1';
import {end } from '../../overlays/divs/end';

const obj1 = new Object(part_sym_2d);
obj1.self.position.z = 3;

const localMachineObj = obj1;
const screenSurface = obj1.basePart.shapes[0];

export {localMachineObj, screenSurface}