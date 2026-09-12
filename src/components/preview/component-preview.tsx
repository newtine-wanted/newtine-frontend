"use client";

import { useState, type ReactNode } from "react";
import {
  BottomSheet,
  Button,
  ButtonLink,
  Dialog,
  Icon,
  ListRow,
  NavBar,
  NumberBadge,
  Pill,
  SheetHandle,
} from "@/components/ui";

const options = ["옵션 A", "옵션 B", "옵션 C"] as const;

const swatches = [
  ["Ink", "bg-foreground"],
  ["Olive", "bg-primary"],
  ["Moss", "bg-accent"],
  ["Surface", "bg-surface"],
  ["Muted", "bg-muted"],
] as const;

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="flex scroll-mt-4 flex-col gap-4 border-t border-divider py-6"
    >
      <h2 id={`${id}-title`} className="text-heading font-bold">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ComponentPreview() {
  const [selected, setSelected] = useState<(typeof options)[number][]>([
    "옵션 A",
  ]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="px-4 py-6">
      <h1 className="text-display font-bold">NEWTINE 컴포넌트</h1>
      <p className="mt-2 text-body-sm text-foreground-secondary">
        디자인 팔레트 · 공용 컴포넌트 · 개발 전용
      </p>
      <Section id="palette" title="색상 팔레트">
        <div className="grid grid-cols-3 gap-3">
          {swatches.map(([label, color]) => (
            <div key={label} className="flex flex-col gap-2">
              <span
                className={`h-14 rounded-control-sm border border-border ${color}`}
              />
              <span className="text-label">{label}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section id="buttons" title="Button · 4타입 × 4크기">
        {(["xl", "lg", "md", "sm"] as const).map((size) => (
          <div key={size} className="flex flex-col gap-2">
            <p className="text-label text-muted">{size.toUpperCase()}</p>
            <div className="grid grid-cols-2 gap-2">
              {(["primary", "secondary", "ghost", "text"] as const).map(
                (variant) => (
                  <Button
                    key={variant}
                    variant={variant}
                    size={size}
                    onClick={() => {}}
                  >
                    {variant}
                  </Button>
                ),
              )}
            </div>
          </div>
        ))}
        <Button disabled fullWidth>
          비활성 버튼
        </Button>
        <ButtonLink href="#pills" variant="ghost">
          링크 버튼 · 선택 컨트롤로 이동
        </ButtonLink>
      </Section>
      <Section id="pills" title="Pill · 선택 / 비선택">
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Pill
              key={option}
              selected={selected.includes(option)}
              onSelectedChange={(checked) =>
                setSelected((current) =>
                  checked
                    ? [...current, option]
                    : current.filter((value) => value !== option),
                )
              }
            >
              {option}
            </Pill>
          ))}
        </div>
        <Pill selected={false} disabled onSelectedChange={() => {}}>
          비활성
        </Pill>
      </Section>
      <Section id="badges" title="Number Badge">
        <div className="flex gap-2">
          {[1, 2, 3].map((value) => (
            <NumberBadge key={value} value={value} />
          ))}
        </div>
      </Section>
      <Section id="navigation" title="Nav Bar · Feed / Back">
        <NavBar
          title="페이지 제목"
          rightAction={{ label: "완료", onClick: () => {} }}
        />
        <NavBar variant="back" title="상세 제목" onBack={() => {}} />
      </Section>
      <Section id="rows" title="List Row · 5종">
        <div>
          <ListRow
            variant="nav-sub"
            label="메뉴 항목"
            sub="메뉴에 대한 보조 설명"
            icon={<Icon name="check" />}
            href="#modals"
          />
          <ListRow
            variant="nav-value"
            label="선택한 항목"
            value={selected.length}
            icon={<Icon name="next" />}
            href="#pills"
          />
          <ListRow variant="quiet-nav" label="보조 메뉴" href="#modals" />
          <ListRow variant="quiet-value" label="앱 버전" value="0.1.0" />
          <ListRow
            variant="quiet-action"
            label="로그아웃"
            onAction={() => setDialogOpen(true)}
          />
        </div>
      </Section>
      <Section id="modals" title="모달">
        <Button onClick={() => setSheetOpen(true)}>바텀시트 열기</Button>
        <Button variant="ghost" onClick={() => setDialogOpen(true)}>
          다이얼로그 열기
        </Button>
        <SheetHandle />
      </Section>
      <BottomSheet
        title="바텀시트 제목"
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        footer={
          <Button fullWidth onClick={() => setSheetOpen(false)}>
            확인
          </Button>
        }
      >
        <p>바텀시트 본문 예시입니다.</p>
      </BottomSheet>
      <Dialog
        title="작업을 진행할까요?"
        description="계속 진행하기 전에 내용을 확인해주세요."
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              취소
            </Button>
            <Button
              onClick={() => {
                setDialogOpen(false);
              }}
            >
              확인
            </Button>
          </div>
        }
      >
        <p>다이얼로그 본문 예시입니다.</p>
      </Dialog>
    </div>
  );
}
