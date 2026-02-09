
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [cursorType, setCursorType] = useState('default');
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

        const cursor = cursorRef.current;
        if (!cursor || isTouchDevice) return;

        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const mouse = { x: pos.x, y: pos.y };
        const speed = 0.4;

        const xSet = gsap.quickSetter(cursor, "x", "px");
        const ySet = gsap.quickSetter(cursor, "y", "px");

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('[data-cursor-type]');
            if (link) {
                const type = link.getAttribute('data-cursor-type') || 'link';
                setCursorType(type);
            } else {
                setCursorType('default');
            }
        };
        
        const handleMouseOut = () => {
             setCursorType('default');
        }

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        gsap.ticker.add(() => {
            const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
            pos.x += (mouse.x - pos.x) * dt;
            pos.y += (mouse.y - pos.y) * dt;
            xSet(pos.x);
            ySet(pos.y);
        });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, [isTouchDevice]);

    if (isTouchDevice) {
        return null;
    }

    const cursorSize = cursorType === 'default' ? 12 : 60;
    const hasViewText = cursorType === 'view';

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center transition-all duration-300 ease-out"
            style={{
                width: `${cursorSize}px`,
                height: `${cursorSize}px`,
                transform: `translate(-50%, -50%)`,
            }}
        >
            {hasViewText && <span className="text-xs font-medium text-black">VIEW</span>}
        </div>
    );
};

export default CustomCursor;
