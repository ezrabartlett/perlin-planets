import { Mesh, BufferGeometry, NormalBufferAttributes, Material } from 'three';

export type meshRefType = React.MutableRefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[]> | null>
