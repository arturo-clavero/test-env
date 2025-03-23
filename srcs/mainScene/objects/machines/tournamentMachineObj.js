import { Object } from '../../../core/objectFactory/Object'
import { materialsgroup, singleMaterial, 
		part_sym_2d, part_sym_3d, 
		part_asym, part_asym_ang,
		threeCube} from '../../../experiments/prev/simpleAssets';

const obj1 = new Object(part_asym);
obj1.self.position.z = 3;
obj1.self.position.x = 4;
obj1.self.position.y = 2;

const tourMachineObj = obj1;
const screenSurface = obj1.basePart.shapes[0];

export {tourMachineObj, screenSurface}