import React, { useCallback, useEffect, useRef } from "react";
import { 
    Color3, 
    Color4, 
    Tools, 
    Vector3,
    Texture as CoreTexture,
} from "@babylonjs/core";
import { 
    Scene, 
    Engine, 
    ArcRotateCamera, 
    Box,
    StandardMaterial,
    HemisphericLight, 
} from 'react-babylonjs'


const MapCuboid = (props) => {

    const sceneRef = useRef()

    const { mapImageData } = props;

    const lightPosition = new Vector3(0, -1, 0)
    const cubeEdgeColor = new Color4(1, 1, 1, 1)
    const cameraAngle = Tools.ToRadians(45)

    // Update Texture if mapImageData changes
    useEffect(() => {
        const scene = sceneRef.current
        if (scene) {
            let wasTexturePresent = false;
            // Remove all textures
            while (scene.textures.length > 0) {
                wasTexturePresent = true;
                scene.textures[0].dispose()
            }
            // Get the material
            const material = scene.getMaterialByName('mapMaterial')
            // Create a new texture
            material.diffuseTexture = new CoreTexture(mapImageData, scene)
            // If a texture was not present before resize the engine
            // This is to fix the blur in the canvas
            if (!wasTexturePresent) {
                scene._engine.resize()
            }
        }
    }, [mapImageData, sceneRef])

    // Removing keyboard and wheel inputs from the camera
    const removeCameraInputs = useCallback((camera) => {
        const inputs = camera.inputs
        inputs.remove(inputs.attached.mousewheel)
        inputs.remove(inputs.attached.keyboard)
    }, [])

    // Saving scene for later use
    const onSceneMountHandler = (sceneEventArgs) => {
        sceneRef.current = sceneEventArgs.scene
    }

    return (
        <Engine
            antialias
            adaptToDeviceRatio
            canvasId="3dMapCanvas">
            <Scene
                clearColor={Color3.White()}
                onSceneMount={onSceneMountHandler}
            >
                <ArcRotateCamera
                    name='mainCamera'
                    alpha={cameraAngle}
                    beta={cameraAngle}
                    radius={9}
                    target={Vector3.Zero()}
                    onCreated={removeCameraInputs}
                />
                <HemisphericLight
                    name='mainLight'
                    position={lightPosition}
                    intensity={1}
                    direction={Vector3.Up()}
                    groundColor={Color3.White()}
                    specular={Color3.Black()}
                />
                <Box
                    name='mapCuboid'
                    size={4}
                    position={Vector3.Zero()}
                    enableEdgesRendering
                    edgesWidth={2}
                    edgesColor={cubeEdgeColor}
                >
                    <StandardMaterial
                        name='mapMaterial'
                        diffuseColor={Color3.White()}
                    >
                    </StandardMaterial>
                </Box>
            </Scene>
        </Engine>
    )
}


export default MapCuboid;