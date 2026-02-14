import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Налаштування
const POINT_COUNT = 70; // Кількість точок (не ставте > 150 для продуктивності)
const CONNECTION_DIST = 2.5; // Відстань, на якій з'являються лінії
const COLOR_MAIN = '#3B82F6'; // Ваш акцентний синій

const NeuralNetwork = () => {
    // 1. Створюємо масив випадкових точок
    const points = useMemo(() => {
        const temp = [];
        for (let i = 0; i < POINT_COUNT; i++) {
            const x = (Math.random() - 0.5) * 20; // Ширина розкиду
            const y = (Math.random() - 0.5) * 12; // Висота розкиду
            const z = 0; // Плоский шар (2D ефект у 3D)
            // Додаємо випадкову швидкість
            const vx = (Math.random() - 0.5) * 0.005;
            const vy = (Math.random() - 0.5) * 0.005;
            temp.push({ pos: new THREE.Vector3(x, y, z), vel: { x: vx, y: vy } });
        }
        return temp;
    }, []);

    const linesGeometryRef = useRef<THREE.BufferGeometry>(null);
    const pointsRef = useRef<THREE.Points>(null);

    // 2. Анімація кожного кадру (60 FPS)
    useFrame(({ mouse, viewport }) => {
        if (!linesGeometryRef.current || !pointsRef.current) return;

        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const linePositions: number[] = [];

        // Координати миші у 3D просторі
        const mouseX = (mouse.x * viewport.width) / 2;
        const mouseY = (mouse.y * viewport.height) / 2;
        const mouseVec = new THREE.Vector3(mouseX, mouseY, 0);

        // Оновлюємо кожну точку
        points.forEach((point, i) => {
            // Рух точок
            point.pos.x += point.vel.x;
            point.pos.y += point.vel.y;

            // Відбивання від країв (щоб не полетіли в космос)
            if (point.pos.x > 10 || point.pos.x < -10) point.vel.x *= -1;
            if (point.pos.y > 6 || point.pos.y < -6) point.vel.y *= -1;

            // Оновлюємо буфер позицій для рендерингу точок
            positions[i * 3] = point.pos.x;
            positions[i * 3 + 1] = point.pos.y;
            positions[i * 3 + 2] = point.pos.z;

            // Перевірка дистанції до миші
            const distToMouse = point.pos.distanceTo(mouseVec);

            // Якщо близько до миші - малюємо лінію
            if (distToMouse < CONNECTION_DIST) {
                linePositions.push(point.pos.x, point.pos.y, point.pos.z);
                linePositions.push(mouseX, mouseY, 0);
            }

            // (Опціонально) З'єднання точок між собою
            for (let j = i + 1; j < points.length; j++) {
                const dist = point.pos.distanceTo(points[j].pos);
                if (dist < 1.5) { // Коротші зв'язки між самими точками
                    linePositions.push(point.pos.x, point.pos.y, point.pos.z);
                    linePositions.push(points[j].pos.x, points[j].pos.y, points[j].pos.z);
                }
            }
        });

        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Оновлюємо геометрію ліній
        linesGeometryRef.current.setFromPoints(
            linePositions.map(p => new THREE.Vector3(0, 0, 0)) // dummy init, реальні дані нижче
        );
        linesGeometryRef.current.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(linePositions, 3)
        );
    });

    return (
        <>
            {/* Точки */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={POINT_COUNT}
                        array={new Float32Array(POINT_COUNT * 3)}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.08} // Розмір точок
                    color={COLOR_MAIN}
                    transparent
                    opacity={0.8}
                    sizeAttenuation
                />
            </points>

            {/* Лінії */}
            <lineSegments>
                <bufferGeometry ref={linesGeometryRef} />
                <lineBasicMaterial
                    color={COLOR_MAIN}
                    transparent
                    opacity={0.15} // Дуже прозорі лінії для елегантності
                    linewidth={1}
                />
            </lineSegments>
        </>
    );
};

const InteractiveBackground = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1, // ВАЖЛИВО: Фон позаду всього
            background: '#030304', // Той самий Void Black колір
            pointerEvents: 'none' // Щоб мишка проходила крізь канвас до кнопок
        }}>
            {/* Canvas - це вікно у 3D світ */}
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                dpr={[1, 2]} // Підтримка Retina дисплеїв
                style={{ pointerEvents: 'auto' }} // Вмикаємо події тільки для Canvas, щоб ловити мишку
                onCreated={({ gl }) => {
                    // Оптимізація: колір фону
                    gl.setClearColor(new THREE.Color('#030304'));
                }}
            >
                <NeuralNetwork />
            </Canvas>

            {/* Градієнтна віньєтка поверх 3D, щоб краї були темними */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'radial-gradient(circle, transparent 40%, #030304 100%)',
                pointerEvents: 'none'
            }}></div>
        </div>
    );
};

export default InteractiveBackground;