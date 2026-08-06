import type { Metadata } from 'next';
import { InlineLink } from '@cometal/react';
import motion from '../../../../../packages/tokens/src/motion.tokens.json';
import { FoundationCategoryHeader } from '../../../components/foundation-category-header';
import { MotionPlayground } from '../../../components/motion-playground';
import { SectionHeading } from '../../../components/section-heading';

export const metadata: Metadata = {
  title: 'Motion — Foundation',
  description: 'Токены движения и правила анимации React-компонентов Cometal.',
};

const state = motion.Motion.Duration.State.$value;
const fast = motion.Motion.Duration.Fast.$value;
const popover = motion.Motion.Duration.Popover.$value;
const spin = motion.Motion.Duration.Spin.$value;
const spinReduced = motion.Motion.Duration['Spin Reduced'].$value;
const standard = `cubic-bezier(${motion.Motion.Easing.Standard.$value.join(', ')})`;
const enter = `cubic-bezier(${motion.Motion.Easing.Enter.$value.join(', ')})`;
const linear = `cubic-bezier(${motion.Motion.Easing.Linear.$value.join(', ')})`;

const tokens = [
  { name: 'motion.duration.state', css: '--cometal-motion-duration-state', value: state, usage: 'Hover, pressed и изменение цвета' },
  { name: 'motion.duration.fast', css: '--cometal-motion-duration-fast', value: fast, usage: 'Fade и reduced-motion переход' },
  { name: 'motion.duration.popover', css: '--cometal-motion-duration-popover', value: popover, usage: 'Select, Multi Select, Date Picker' },
  { name: 'motion.duration.spin', css: '--cometal-motion-duration-spin', value: spin, usage: 'Один оборот loader' },
  { name: 'motion.duration.spin-reduced', css: '--cometal-motion-duration-spin-reduced', value: spinReduced, usage: 'Loader при reduced motion' },
  { name: 'motion.easing.standard', css: '--cometal-motion-easing-standard', value: standard, usage: 'Изменение состояния control' },
  { name: 'motion.easing.enter', css: '--cometal-motion-easing-enter', value: enter, usage: 'Появление слоя рядом с trigger' },
  { name: 'motion.easing.linear', css: '--cometal-motion-easing-linear', value: linear, usage: 'Непрерывное вращение loader' },
];

export default function FoundationMotionPage() {
  return (
    <main className="content-page">
      <FoundationCategoryHeader
        title="Motion"
        description="Единый язык движения для React-компонентов Cometal. Motion объясняет изменение состояния, не замедляя работу."
      />

      <section className="content-section">
        <SectionHeading title="Принцип" description="Не украшать. Объяснять изменение состояния и связь между trigger и новым слоем." />
        <div className="portal-motion-anatomy">
          <article><code>Duration</code><strong>Как долго</strong><p>Коротко для частых действий, чуть дольше для появления слоя.</p></article>
          <article><code>Easing</code><strong>Как движется</strong><p>Enter быстро отвечает на действие и мягко замедляется к финалу.</p></article>
          <article><code>Property</code><strong>Что меняется</strong><p>Для UI используем opacity и transform, не анимируем layout.</p></article>
        </div>
      </section>

      <section className="content-section">
        <SectionHeading title="Токены" description="Код и Storybook используют один token source. В Figma эти значения должны быть документацией, а не переменными визуального стиля." />
        <div className="portal-motion-tokens">
          {tokens.map((token) => (
            <article key={token.name}>
              <code>{token.name}</code>
              <strong>{token.value}</strong>
              <span>{token.usage}</span>
              <small>{token.css}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section portal-motion-curve-section">
        <div>
          <SectionHeading title="Кривая enter" description="Сильный ease-out сразу отвечает на действие и затем мягко останавливает элемент." />
          <code>{enter}</code>
        </div>
        <svg className="portal-motion-curve" viewBox="0 0 320 176" role="img" aria-label={`Enter easing: ${enter}`}>
          <line x1="24" y1="152" x2="296" y2="152" />
          <line x1="24" y1="152" x2="24" y2="24" />
          <path d="M 24 152 C 68 24, 106 24, 296 24" />
          <circle cx="24" cy="152" r="5" />
          <circle cx="296" cy="24" r="5" />
          <text x="24" y="170">0</text>
          <text x="258" y="170">100%</text>
        </svg>
      </section>

      <section className="content-section">
        <SectionHeading title="Живой пример" description="Один и тот же сценарий показывает обычный и reduced-motion режимы." />
        <MotionPlayground />
      </section>

      <section className="content-section">
        <SectionHeading title="Правила применения" description="Поведение зависит от способа взаимодействия и системных настроек пользователя." />
        <div className="portal-motion-rules">
          <article><code>Pointer</code><strong>Движение допустимо</strong><p>Select и Date Picker показывают связь trigger и popover.</p></article>
          <article><code>Keyboard</code><strong>Без задержки</strong><p>Частые клавиатурные действия не должны ощущаться медленными.</p></article>
          <article><code>Reduced motion</code><strong>Без сдвига</strong><p>Убираем translate, оставляем короткое opacity или мгновенное изменение.</p></article>
        </div>
        <InlineLink className="technical-link" href="/storybook/?path=/story/foundation--motion" touchTarget>Открыть техническую Motion story ↗</InlineLink>
      </section>
    </main>
  );
}
