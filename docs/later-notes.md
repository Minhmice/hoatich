# Backlog & Later Notes — Hoa Tích

## Hoạt ảnh Camera 3D Lerp theo phân cảnh (View-driven 3D Camera Transition)

- **Trạng thái:** Tạm hoãn (Skipped / To-do sau).
- **Hiện trạng:**
  - Camera diorama (`DioramaCamera.ts` / `ThreeShopView.ts`) đang dùng góc nhìn cố định bao quát toàn cảnh quầy và bàn làm việc.
  - Ba layout (`LobbyView`, `CounterView`, `WorkspaceView`) hiện chỉ hoán chuyển tầng giao diện DOM UI phía trên, giữ nguyên vị trí camera nền.
- **Mục tiêu kỹ thuật:**
  - Khi chuyển sang `CounterView`: Camera Three.js lerp mượt mà (vị trí + `lookAt`) tiến gần hơn về phía quầy tiếp khách và nhân vật.
  - Khi chuyển sang `WorkspaceView`: Camera Three.js lerp hạ thấp góc quay và tập trung nghiêng sâu xuống mặt bàn cắm hoa (`Workstation3D`).
  - Khi quay về `LobbyView`: Camera Three.js lerp hồi vị về góc nhìn bao quát toàn bộ gian tiệm.
- **Điều kiện kích hoạt:**
  - Triển khai khi tinh chỉnh trải nghiệm thị giác chuyển động chuyên sâu cho 3D diorama.
