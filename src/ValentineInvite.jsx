import React, { useEffect, useMemo, useRef, useState } from "react";
import post1 from "./assets/right.jpg";
import post2 from "./assets/left.jpg";
/**
 * 발렌타인데이 초대장 (React)
 * - "응" 버튼: 클릭 가능
 * - "아니" 버튼: 마우스 올리면 도망감(컨테이너 안에서만 이동)
 *
 * 사용: 이 컴포넌트만 렌더링하면 됨.
 */
export default function ValentineInvite() {
  const containerRef = useRef(null);
  const noBtnRef = useRef(null);

  const [accepted, setAccepted] = useState(false);

  // "아니" 버튼 위치 (컨테이너 기준)
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  // 초기 배치
  useEffect(() => {
    const placeInitial = () => {
      const container = containerRef.current;
      const noBtn = noBtnRef.current;
      if (!container || !noBtn) return;

      const cw = container.clientWidth;
      const ch = container.clientHeight;
      const bw = noBtn.offsetWidth;
      const bh = noBtn.offsetHeight;

      // 아래쪽 오른편 근처에 시작
      const x = Math.max(12, Math.min(cw - bw - 12, Math.round(cw * 0.58)));
      const y = Math.max(12, Math.min(ch - bh - 12, Math.round(ch * 0.68)));

      setNoPos({ x, y });
    };

    placeInitial();
    window.addEventListener("resize", placeInitial);
    return () => window.removeEventListener("resize", placeInitial);
  }, []);

  const styles = useMemo(
    () => ({
      page: {
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        position: "relative", // ✅ 추가
        zIndex: 1,    
        background:
          "radial-gradient(1200px 600px at 20% 10%, #ffe1ea 0%, rgba(255,225,234,0) 55%), radial-gradient(900px 500px at 80% 90%, #ffd1f0 0%, rgba(255,209,240,0) 55%), linear-gradient(180deg, #fff 0%, #fff7fb 100%)",
        fontFamily:
          'system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
        color: "#1f1f1f",
      },
      card: {
        width: "min(520px, 92vw)",
        borderRadius: 22,
        background: "rgba(255,255,255,0.8)",
        boxShadow:
          "0 20px 60px rgba(255, 64, 129, 0.15), 0 6px 18px rgba(0,0,0,0.06)",
        border: "1px solid rgba(255, 64, 129, 0.18)",
        overflow: "hidden",
        backdropFilter: "blur(10px)",
      },
      header: {
        padding: "18px 20px",
        background:
          "linear-gradient(90deg, rgba(255,64,129,0.12), rgba(255,64,129,0.06))",
        display: "flex",
        alignItems: "center",
        gap: 10,
      },
      badge: {
        fontSize: 12,
        padding: "6px 10px",
        borderRadius: 999,
        background: "rgba(255,64,129,0.12)",
        border: "1px solid rgba(255,64,129,0.18)",
        color: "#ff4081",
        fontWeight: 700,
        letterSpacing: 0.2,
      },
      title: {
        margin: 0,
        fontSize: 16,
        fontWeight: 800,
      },
      body: {
        padding: 20,
      },
      question: {
        margin: "10px 0 0",
        fontSize: 28,
        fontWeight: 900,
        letterSpacing: -0.5,
        lineHeight: 1.2,
      },
      sub: {
        margin: "10px 0 0",
        fontSize: 14,
        color: "rgba(0,0,0,0.55)",
      },
      playground: {
        marginTop: 18,
        position: "relative",
        height: 220,
        borderRadius: 18,
        background:
          "linear-gradient(180deg, rgba(255,64,129,0.06), rgba(255,64,129,0.02))",
        border: "1px dashed rgba(255,64,129,0.25)",
        overflow: "hidden",
      },
      footerNote: {
        marginTop: 12,
        fontSize: 12,
        color: "rgba(0,0,0,0.45)",
      },
      yesBtn: {
        position: "absolute",
        left: 24,
        bottom: 24,
        padding: "12px 18px",
        borderRadius: 14,
        border: "none",
        cursor: "pointer",
        fontSize: 16,
        fontWeight: 900,
        color: "white",
        background: "linear-gradient(180deg, #ff4081, #ff2d6d)",
        boxShadow: "0 10px 24px rgba(255,64,129,0.28)",
        transform: "translateZ(0)",
      },
      noBtn: {
        position: "absolute",
        left: noPos.x,
        top: noPos.y,
        padding: "12px 18px",
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,0.12)",
        cursor: "not-allowed",
        fontSize: 16,
        fontWeight: 900,
        background: "rgba(255,255,255,0.9)",
        boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
        userSelect: "none",
        transition: "left 140ms ease, top 140ms ease, transform 120ms ease",
        transform: "translateZ(0)",
      },
      acceptedWrap: {
        marginTop: 14,
        padding: 14,
        borderRadius: 16,
        border: "1px solid rgba(34,197,94,0.25)",
        background: "rgba(34,197,94,0.08)",
        color: "rgba(0,0,0,0.8)",
        fontSize: 14,
        lineHeight: 1.4,
      },
    }),
    [noPos.x, noPos.y]
  );

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const moveNoButton = () => {
    const container = containerRef.current;
    const noBtn = noBtnRef.current;
    if (!container || !noBtn) return;

    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const bw = noBtn.offsetWidth;
    const bh = noBtn.offsetHeight;

    // 안전 패딩(벽에 너무 딱 붙지 않게)
    const pad = 12;

    // 현재 위치와 충분히 멀어지도록 시도
    // (여러 번 뽑아서 최대 거리 후보 선택)
    const tries = 8;
    let best = null;
    let bestDist = -1;

    for (let i = 0; i < tries; i++) {
      const x = Math.round(Math.random() * (cw - bw - pad * 2) + pad);
      const y = Math.round(Math.random() * (ch - bh - pad * 2) + pad);

      const dx = x - noPos.x;
      const dy = y - noPos.y;
      const dist = Math.hypot(dx, dy);

      if (dist > bestDist) {
        bestDist = dist;
        best = { x, y };
      }
    }

    // 혹시 버튼이 너무 작거나 영역이 작을 때 대비해 clamp
    const x = clamp(best?.x ?? pad, pad, cw - bw - pad);
    const y = clamp(best?.y ?? pad, pad, ch - bh - pad);

    setNoPos({ x, y });
  };

  const onYes = () => {
    setAccepted(true);
  };

  return (
    <div style={styles.page}>
        <div className="left-collage" aria-hidden="true">
        <div className="polaroid p1">
            <img src={post2} alt="" />
            <div className="sparkle">
                <span /><span /><span /><span />
            </div>
            </div>

            <div className="polaroid p2">
            <img src={post1} alt="" />
            <div className="sparkle">
                <span /><span /><span /><span />
            </div>
            </div>
        </div>

      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.badge}>💌 INVITE</span>
          <h1 style={styles.title}>발렌타인데이 초대장</h1>
        </div>

        <div style={styles.body}>
          <div style={styles.question}>나랑 발렌타인데이 같이 보낼래?</div>
          <div style={styles.sub}>
            선택지를 클릭해주세용 💕
          </div>

          <div ref={containerRef} style={styles.playground}>
            <button
              type="button"
              style={styles.yesBtn}
              onClick={onYes}
              aria-label="응"
            >
              응 💖
            </button>

            <button
              ref={noBtnRef}
              type="button"
              style={styles.noBtn}
              onMouseEnter={moveNoButton}
              onMouseMove={moveNoButton}
              onFocus={moveNoButton}
              onClick={(e) => {
                // 클릭도 막아두기(혹시 모바일에서 탭될 수도 있으니)
                e.preventDefault();
                moveNoButton();
              }}
              aria-label="아니"
              title="잡아봐 😜"
            >
              아니 🙅‍♂️
            </button>
          </div>

          {accepted && (
            <div style={styles.acceptedWrap}>
              <div style={{ fontWeight: 900, marginBottom: 6 }}>
                ✅ 약속 성사!
              </div>
                <br />
                💌일시 : 2월 14일 
              장소 : 김해공항 국내선✈️
            </div>
          )}

          <div style={styles.footerNote}>
            
          </div>
        </div>
      </div>
    </div>
  );
}
