import { Object } from '../../../core/objectFactory/Object'
import { materialsgroup, singleMaterial, 
		part_sym_2d, part_sym_3d, 
		part_asym, part_asym_ang,
		threeCube} from '../../../experiments/prev/simpleAssets';

const obj1 = new Object(part_sym_3d);
obj1.self.position.z = 3;
obj1.self.position.x = 0;
obj1.self.position.y = 2;

const aiMachineObj = obj1;
const screenSurface = obj1.basePart.shapes[0];

export {aiMachineObj, screenSurface}