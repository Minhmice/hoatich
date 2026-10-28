'use client';


export function DebugHub() {
  return (
    <div className="debug-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'serif' }}>
      <h1>Phòng thử nghiệm Hoa Tích (Debug Hub)</h1>
      <p>Các công cụ thử nghiệm chạy trong sandbox bộ nhớ hoặc độc lập với tiến trình người chơi.</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '1rem 0' }}>
          <a href="/debug/state/" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>1. State & Lưu Trữ Sandbox</a>
          <p>Nhảy ca, thử hỏng bản lưu, nạp đầy kho hoa, kiểm tra phục hồi save.</p>
        </li>
        <li style={{ margin: '1rem 0' }}>
          <a href="/debug/bouquet3d/" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>2. Bàn Cắm Hoa 3D</a>
          <p>Thử nghiệm xoay, phân tầng, xếp cành hoa và chấm điểm quy tắc.</p>
        </li>
        <li style={{ margin: '1rem 0' }}>
          <a href="/debug/dialogue/" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>3. Hội Thoại & Nhánh Kịch Bản</a>
          <p>Duyệt mọi node thoại, thử các lựa chọn đối thoại và kiểm tra cờ sự kiện.</p>
        </li>
        <li style={{ margin: '1rem 0' }}>
          <a href="/debug/audio/" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>4. Âm Thanh & Nhạc Nền</a>
          <p>Thử synth ambient ca ngày/đêm và các hiệu ứng âm thanh đặt hoa, trao hoa.</p>
        </li>
      </ul>
      <p style={{ marginTop: '2rem' }}>
        <a href="/">← Quay lại trò chơi</a>
      </p>
    </div>
  );
}
