import { useState } from 'react';
import { Button, Modal, Tooltip } from '../shared/ui';

export function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="playground">
      <section className="playground__panel">
        <p className="playground__eyebrow">Sloi UI</p>
        <h1>UI Kit Playground</h1>
        <p className="playground__description">
          Палитра разделена на raw-цвета и семантические токены, чтобы библиотека оставалась
          универсальной для разных доменов.
        </p>
        <div className="playground__row">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Open Modal
          </Button>
          <Tooltip content="Tooltip wrapper" delayDuration={150}>
            <Button variant="ghost">Hover me</Button>
          </Tooltip>
        </div>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Modal Wrapper"
          className="playground__modal"
        >
          Это наш компонент на базе Radix Dialog с полным контролем визуала и API.
          <div className="playground__dialog-actions">
            <Button size="sm" onClick={() => setModalOpen(false)}>
              Close
            </Button>
          </div>
        </Modal>
        <div className="playground__status-grid">
          <span className="playground__chip playground__chip--info">Info</span>
          <span className="playground__chip playground__chip--success">Success</span>
          <span className="playground__chip playground__chip--warning">Warning</span>
          <span className="playground__chip playground__chip--danger">Danger</span>
        </div>
        <div className="playground__accent-grid">
          <span className="playground__accent" />
          <span className="playground__accent playground__accent--violet" />
          <span className="playground__accent playground__accent--cyan" />
          <span className="playground__accent playground__accent--pink" />
        </div>
      </section>
    </main>
  );
}
