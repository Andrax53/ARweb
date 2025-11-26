import React, { useState, useRef, useEffect } from 'react';
import './GlassesFitting.css';

const GlassesFitting = () => {
    const [started, setStarted] = useState(false);
    const [currentModel, setCurrentModel] = useState('none');
    const [loading, setLoading] = useState(false);
    const sceneRef = useRef(null);

    const glassesModels = [
        { id: 'none', name: 'Без очков' },
        { id: 'glasses1', name: 'Очки 1' },
        { id: 'glasses2', name: 'Очки 2' }
    ];

    const handleStart = async () => {
        setLoading(true);
        try {
            if (sceneRef.current) {
                const scene = sceneRef.current;
                const faceSystem = scene.systems['mindar-face-system'];

                if (faceSystem) {
                    await faceSystem.start();
                    setStarted(true);

                    setTimeout(() => {
                        const video = document.querySelector('video');
                        if (video) {
                            video.style.display = 'block';
                            video.style.position = 'absolute';
                            video.style.top = '0';
                            video.style.left = '0';
                            video.style.width = '100%';
                            video.style.height = '100%';
                            video.style.objectFit = 'cover';
                            video.style.zIndex = '0';
                        }
                    }, 500);
                }
            }
        } catch (error) {
            console.error('Failed to start AR:', error);
            alert('Не удалось запустить камеру. Проверьте разрешения.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectGlasses = (modelId) => {
        setCurrentModel(modelId);
    };

    useEffect(() => {
        if (!sceneRef.current) return;

        const hideAllGlasses = () => {
            const allGlasses = sceneRef.current.querySelectorAll('.glasses-entity');
            allGlasses.forEach(glasses => {
                glasses.setAttribute('visible', 'false');
            });
        };

        hideAllGlasses();

        if (currentModel !== 'none') {
            const selectedGlasses = sceneRef.current.querySelectorAll(`.${currentModel}-entity`);
            selectedGlasses.forEach(glasses => {
                glasses.setAttribute('visible', 'true');
            });
        }
    }, [currentModel]);

    return (
        <div className="glasses-fitting-container">
            {!started && (
                <button
                    id="startButton"
                    className={`start-button ${loading ? 'loading' : ''}`}
                    onClick={handleStart}
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : 'Начать примерку'}
                </button>
            )}

            <div className="controls-panel">
                <div className="glasses-grid">
                    {glassesModels.map((model) => (
                        <button
                            key={model.id}
                            className={`glass-button ${currentModel === model.id ? 'selected' : ''}`}
                            onClick={() => handleSelectGlasses(model.id)}
                        >
                            {model.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="ar-container">
                <a-scene
                    ref={sceneRef}
                    mindar-face="
            uiScanning: no;
            uiLoading: no;
            uiError: no;
          "
                    embedded
                    color-space="sRGB"
                    renderer="colorManagement: true; physicallyCorrectLights: false;"
                    vr-mode-ui="enabled: false"
                    device-orientation-permission-ui="enabled: false"
                >
                    <a-assets>
                        <a-asset-item
                            id="headModel"
                            src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/sparkar/headOccluder.glb"
                        ></a-asset-item>
                        <a-asset-item id="glassesModel1" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/glasses/scene.gltf"></a-asset-item>
                        <a-asset-item id="glassesModel2" src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.5/examples/face-tracking/assets/glasses2/scene.gltf"></a-asset-item>
                    </a-assets>

                    {/* Head occluder */}
                    <a-entity mindar-face-target="anchorIndex: 168">
                        <a-gltf-model
                            mindar-face-occluder
                            rotation="0 0 0"
                            position="0 -0.3 0.15"
                            scale="0.065 0.065 0.065"
                            src="#headModel"
                        ></a-gltf-model>
                    </a-entity>

                    <a-camera active="false" position="0 0 0"></a-camera>

                    {/* Glasses models */}
                    <a-entity mindar-face-target="anchorIndex: 168">
                        <a-gltf-model
                            class="glasses-entity glasses1-entity"
                            src="#glassesModel1"
                            rotation="0 0 0"
                            position="0 0 0"
                            scale="0.01 0.01 0.01"
                            visible="false"
                        ></a-gltf-model>
                    </a-entity>

                    <a-entity mindar-face-target="anchorIndex: 168">
                        <a-gltf-model
                            class="glasses-entity glasses2-entity"
                            src="#glassesModel2"
                            rotation="0 -90 0"
                            position="0 -0.3 0"
                            scale="0.6 0.6 0.6"
                            visible="false"
                        ></a-gltf-model>
                    </a-entity>
                </a-scene>
            </div>

            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Загрузка AR...</p>
                </div>
            )}
        </div>
    );
};

export default GlassesFitting;
