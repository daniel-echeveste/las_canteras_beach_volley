import React, { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Cylinder, Sphere } from "@react-three/drei";
import * as THREE from "three";

/**
 * Beach Volleyball Court with realistic gameplay animation
 * 
 * Gameplay phases (per side):
 * 1. RECEPTION - Back player receives serve/attack, passes to front
 * 2. SET - Front player sets the ball high near the net
 * 3. ATTACK - Back player approaches and spikes over the net
 * 
 * Then the sequence repeats on the other side
 */

// Lerp helper for smooth movement
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Animated Player with position following
function AnimatedPlayer({ basePosition, targetPosition, color, phase, role }) {
    const ref = useRef();
    const currentPos = useRef(new THREE.Vector3(...basePosition));

    useFrame((state, delta) => {
        if (ref.current) {
            const time = state.clock.getElapsedTime();

            // Smoothly move toward target position
            currentPos.current.x = lerp(currentPos.current.x, targetPosition[0], delta * 3);
            currentPos.current.z = lerp(currentPos.current.z, targetPosition[2], delta * 3);

            ref.current.position.x = currentPos.current.x;
            ref.current.position.z = currentPos.current.z;

            // Idle animation + action-based movement
            ref.current.rotation.z = Math.sin(time * 1.5) * 0.03;
            ref.current.position.y = basePosition[1] + Math.sin(time * 2) * 0.02;

            // Jump during attack phase
            if (role === 'attacker' && phase === 'attack') {
                const jumpPhase = (time * 2) % 1;
                if (jumpPhase > 0.3 && jumpPhase < 0.7) {
                    ref.current.position.y = basePosition[1] + Math.sin((jumpPhase - 0.3) * Math.PI / 0.4) * 0.8;
                }
            }
        }
    });

    return (
        <group ref={ref} position={basePosition}>
            {/* Body */}
            <Cylinder args={[0.25, 0.3, 1.4, 16]} position={[0, 0.2, 0]} castShadow receiveShadow>
                <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
            </Cylinder>
            {/* Head */}
            <Sphere args={[0.2, 16, 16]} position={[0, 1.1, 0]} castShadow>
                <meshStandardMaterial color="#FFE0BD" roughness={0.8} />
            </Sphere>
            {/* Arms */}
            <Cylinder args={[0.08, 0.08, 0.5, 8]} position={[0.35, 0.5, 0]} rotation={[0, 0, -0.5]} castShadow>
                <meshStandardMaterial color={color} roughness={0.6} />
            </Cylinder>
            <Cylinder args={[0.08, 0.08, 0.5, 8]} position={[-0.35, 0.5, 0]} rotation={[0, 0, 0.5]} castShadow>
                <meshStandardMaterial color={color} roughness={0.6} />
            </Cylinder>
        </group>
    );
}

// Volleyball with 3-touch animation per side
function VolleyballGame({ courtOffset }) {
    const ballRef = useRef();
    const [phaseOffset] = useState(Math.random() * Math.PI * 2);

    // Game state
    const gameState = useRef({
        phase: 0, // 0-5: 6 phases total (3 per side)
        phaseTime: 0,
    });

    // Phase durations (seconds)
    const phaseDurations = [1.2, 1.0, 0.8, 1.2, 1.0, 0.8]; // reception, set, attack x2
    const cycleDuration = phaseDurations.reduce((a, b) => a + b, 0);

    // Ball positions for each phase (relative to court center)
    // Team A (Z < 0): Reception at back, Set near net, Attack from position
    // Team B (Z > 0): Same pattern
    // const ballWaypoints = [
    //     // Team A receives (ball coming from Team B's attack)
    //     { start: [0, 4, 3], end: [-2, 2, -5], height: 3 },      // 0: Reception (back-left player)
    //     { start: [-2, 2, -5], end: [2, 3.5, -1], height: 4 },   // 1: Set (front-right player sets)
    //     { start: [2, 3.5, -1], end: [0, 4, 3], height: 4.5 },   // 2: Attack (spike over net)
    //     // Team B receives
    //     { start: [0, 4, -3], end: [2, 2, 5], height: 3 },       // 3: Reception (back-right player)
    //     { start: [2, 2, 5], end: [-2, 3.5, 1], height: 4 },     // 4: Set (front-left player sets)
    //     { start: [-2, 3.5, 1], end: [0, 4, -3], height: 4.5 },  // 5: Attack (spike over net)
    // ];
    const ballWaypoints = [
        // Team A receives (ball coming from Team B's attack)
        { start: [0, 1, -5], end: [-0.50, 2, -0.5], height: 5 },      // 0: Reception (back-left player)
        { start: [0, 2, -0.5], end: [0, 4, -0.5], height: 4 },   // 1: Set (front-right player sets)
        { start: [0, 4, 0], end: [0, 1, 5], height: 0 },   // 2: Attack (spike over net)
        // Team B receives
        { start: [0, 1, 5], end: [2, 2, 5], height: 0 },       // 3: Reception (back-right player)
        { start: [2, 2, 5], end: [-2, 3.5, 1], height: 4 },     // 4: Set (front-left player sets)
        { start: [-2, 3.5, 1], end: [0, 4, -3], height: 4.5 },  // 5: Attack (spike over net)
    ];

    // Player positions for each phase
    const playerPositions = {
        teamA: {
            player1: [ // Back/Receiver -> Attacker
                [-2, 0.9, -5],  // 0: Receiving position (back-left)
                [-1, 0.9, -4],  // 1: Moving forward while set
                [1, 0.9, -2],   // 2: Attack position (near net)
                [-2, 0.9, -4],  // 3: Reset to base
                [-2, 0.9, -4],  // 4: Waiting
                [-2, 0.9, -5],  // 5: Back to receive
            ],
            player2: [ // Front/Setter
                [2, 0.9, -2],   // 0: Ready position
                [2, 0.9, -1],   // 1: Setting position (near net)
                [2, 0.9, -3],   // 2: Move back after set
                [2, 0.9, -3],   // 3: Watching
                [2, 0.9, -2],   // 4: Ready
                [2, 0.9, -2],   // 5: Ready to receive
            ],
        },
        teamB: {
            player1: [ // Back/Receiver -> Attacker
                [2, 0.9, 4],    // 0: Watching
                [2, 0.9, 4],    // 1: Watching
                [2, 0.9, 5],    // 2: Back to receive
                [2, 0.9, 5],    // 3: Receiving position
                [1, 0.9, 4],    // 4: Moving while set
                [-1, 0.9, 2],   // 5: Attack position
            ],
            player2: [ // Front/Setter
                [-2, 0.9, 2],   // 0: Ready
                [-2, 0.9, 2],   // 1: Ready
                [-2, 0.9, 3],   // 2: Ready to receive
                [-2, 0.9, 3],   // 3: Ready
                [-2, 0.9, 1],   // 4: Setting position
                [-2, 0.9, 3],   // 5: Move back after set
            ],
        },
    };

    useFrame((state, delta) => {
        if (!ballRef.current) return;

        const time = state.clock.getElapsedTime() + phaseOffset;
        const cycleTime = time % cycleDuration;

        // Determine current phase
        let phase = 0;
        let accumulated = 0;
        let phaseProgress = 0;

        for (let i = 0; i < phaseDurations.length; i++) {
            if (cycleTime < accumulated + phaseDurations[i]) {
                phase = i;
                phaseProgress = (cycleTime - accumulated) / phaseDurations[i];
                break;
            }
            accumulated += phaseDurations[i];
        }

        gameState.current.phase = phase;

        // Get ball waypoint for current phase
        const waypoint = ballWaypoints[phase];

        // Interpolate ball position with parabolic arc
        const t = phaseProgress;
        const x = lerp(waypoint.start[0], waypoint.end[0], t);
        const z = lerp(waypoint.start[2], waypoint.end[2], t);

        // Parabolic height: h(t) = start_y + (peak - start) * 4t(1-t) for t in [0,1]
        const startY = waypoint.start[1];
        const endY = waypoint.end[1];
        const baseY = lerp(startY, endY, t);
        const arcHeight = waypoint.height * 4 * t * (1 - t);
        const y = baseY + arcHeight;

        ballRef.current.position.set(x, y, z);

        // Ball spin
        ballRef.current.rotation.x += delta * 8;
        ballRef.current.rotation.y += delta * 3;
    });

    // Get current phase for player animations
    const getPhase = () => gameState.current.phase;
    const time = useRef(0);
    useFrame((state) => { time.current = state.clock.getElapsedTime() + phaseOffset; });

    const getCurrentPhase = () => {
        const cycleTime = time.current % cycleDuration;
        let accumulated = 0;
        for (let i = 0; i < phaseDurations.length; i++) {
            if (cycleTime < accumulated + phaseDurations[i]) return i;
            accumulated += phaseDurations[i];
        }
        return 0;
    };

    // Player position component that reads game state
    function GamePlayer({ team, playerNum, color }) {
        const [phase, setPhase] = useState(0);

        useFrame(() => {
            setPhase(getCurrentPhase());
        });

        const positions = team === 'A'
            ? (playerNum === 1 ? playerPositions.teamA.player1 : playerPositions.teamA.player2)
            : (playerNum === 1 ? playerPositions.teamB.player1 : playerPositions.teamB.player2);

        const isAttacker = (team === 'A' && playerNum === 1 && phase === 2) ||
            (team === 'B' && playerNum === 1 && phase === 5);

        return (
            <AnimatedPlayer
                basePosition={positions[0]}
                targetPosition={positions[phase]}
                color={color}
                phase={phase === 2 || phase === 5 ? 'attack' : 'normal'}
                role={isAttacker ? 'attacker' : 'normal'}
            />
        );
    }

    return (
        <>
            {/* Ball */}
            <Sphere ref={ballRef} args={[0.22, 32, 32]} castShadow>
                <meshStandardMaterial color="white" roughness={0.4} metalness={0.1} />
            </Sphere>

            {/* Team A - Red */}
            <GamePlayer team="A" playerNum={1} color="#e63946" />
            <GamePlayer team="A" playerNum={2} color="#e63946" />

            {/* Team B - Blue */}
            <GamePlayer team="B" playerNum={1} color="#457b9d" />
            <GamePlayer team="B" playerNum={2} color="#457b9d" />
        </>
    );
}

// Enhanced Net Component
function Net({ width = 8.5 }) {
    const netMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: 'black',
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        roughness: 0.9
    }), []);

    return (
        <group>
            <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
                <boxGeometry args={[width, 1.2, 0.05]} />
                <primitive object={netMaterial} />
            </mesh>
            <mesh position={[0, 2.35, 0]}>
                <boxGeometry args={[width, 0.1, 0.08]} />
                <meshStandardMaterial color="white" />
            </mesh>
            {/* Poles */}
            <mesh position={[width / 2, 1.2, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 2.6]} />
                <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[-width / 2, 1.2, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 2.6]} />
                <meshStandardMaterial color="#444444" metalness={0.6} roughness={0.4} />
            </mesh>
            {/* Antennas */}
            <mesh position={[width / 2 - 0.25, 1.7, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 2.4]} />
                <meshStandardMaterial color="#ff4444" />
            </mesh>
            <mesh position={[-width / 2 + 0.25, 1.7, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 2.4]} />
                <meshStandardMaterial color="#ff4444" />
            </mesh>
        </group>
    );
}

// Court Lines
function CourtLines({ width = 8, length = 16 }) {
    const lineColor = "#ffffff";
    const hw = width / 2;
    const hl = length / 2;

    return (
        <group position={[0, 0.03, 0]}>
            {/* Sidelines */}
            <mesh position={[hw, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.08, length]} />
                <meshStandardMaterial color={lineColor} />
            </mesh>
            <mesh position={[-hw, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.08, length]} />
                <meshStandardMaterial color={lineColor} />
            </mesh>
            {/* Endlines */}
            <mesh position={[0, 0, hl]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[width + 0.08, 0.08]} />
                <meshStandardMaterial color={lineColor} />
            </mesh>
            <mesh position={[0, 0, -hl]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[width + 0.08, 0.08]} />
                <meshStandardMaterial color={lineColor} />
            </mesh>
        </group>
    );
}

// Single Court with gameplay
function Court({ position, courtIndex }) {
    const courtWidth = 8;
    const courtLength = 16;

    return (
        <group position={position} rotation={[0, Math.PI / 2, 0]}>
            {/* Court Sand */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
                <planeGeometry args={[courtWidth + 2, courtLength + 2]} />
                <meshStandardMaterial color="#f0d599" roughness={0.95} />
            </mesh>

            <CourtLines width={courtWidth} length={courtLength} />
            <Net width={courtWidth} />
            <VolleyballGame courtOffset={courtIndex * 1.5} />
        </group>
    );
}

// All Courts - Larger and more spread apart
export default function Courts() {
    const courts = [];
    const spacing = { x: 22, z: 35 }; // Increased spacing

    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 4; col++) {
            const x = (col - 1.5) * spacing.x;
            const z = (row - 0.5) * spacing.z;
            courts.push(
                <Court
                    key={`${row}-${col}`}
                    position={[z, 0, x]}
                    courtIndex={row * 4 + col}
                />
            );
        }
    }

    return <>{courts}</>;
}
