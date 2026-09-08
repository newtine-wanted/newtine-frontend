"use client";

import { useState, type ReactNode } from "react";
import {
  ActionBar,
  BottomSheet,
  Button,
  ButtonLink,
  Dialog,
  Icon,
  IssueCard,
  ListRow,
  NavBar,
  NumberBadge,
  OverlayLabel,
  Pill,
  SheetHandle,
  Toast,
  TopicChip,
} from "@/components/ui";
import { topics, type Topic } from "@/design-system/topics";
import { HomeIndicator, StatusBar } from "./device-chrome";

const exampleIssue = {
  topic: "housing" as const,
  title: "청년 월세 지원, 소득 기준 완화해 대상 2배로 늘린다",
  articleCount: 4,
  summary: [
    "월세 지원 대상 소득 기준이 중위소득 60%→100%로 완화된다",
    "신청은 다음 달 1일부터 복지로·주민센터에서 가능",
    "예산은 기존 대비 2배, 야당은 재원 근거 부족을 지적",
  ] as const,
};

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
  const [selected, setSelected] = useState<Topic[]>(["housing"]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toast, setToast] = useState({
    type: "like" as "like" | "skip",
    key: 0,
  });
  const [revealKey, setRevealKey] = useState(0);

  function notify(type: "like" | "skip") {
    setToast((current) => ({ type, key: current.key + 1 }));
    setToastOpen(true);
  }

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
                    onClick={() => notify("like")}
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
        <ButtonLink href="#chips" variant="ghost">
          링크 버튼 · 주제 칩으로 이동
        </ButtonLink>
      </Section>
      <Section id="chips" title="Topic Chip · 12주제">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(topics) as Topic[]).map((topic) => (
            <TopicChip key={topic} topic={topic} />
          ))}
        </div>
      </Section>
      <Section id="pills" title="Pill · 선택 / 비선택">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(topics) as Topic[]).map((topic) => (
            <Pill
              key={topic}
              selected={selected.includes(topic)}
              onSelectedChange={(checked) =>
                setSelected((current) =>
                  checked
                    ? [...current, topic]
                    : current.filter((value) => value !== topic),
                )
              }
            >
              {topics[topic].label}
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
          title="NEWTINE"
          rightAction={{ label: "우측 액션", onClick: () => notify("like") }}
        />
        <NavBar
          variant="back"
          title="뉴스 상세"
          onBack={() => notify("skip")}
        />
      </Section>
      <Section id="rows" title="List Row · 5종">
        <div>
          <ListRow
            variant="nav-sub"
            label="관심 뉴스"
            sub="관심 있는 이슈를 다시 확인해요"
            icon={<Icon name="housing" />}
            href="#cards"
          />
          <ListRow
            variant="nav-value"
            label="선택한 관심사"
            value={selected.length}
            icon={<Icon name="topic" />}
            href="#pills"
          />
          <ListRow variant="quiet-nav" label="계정 관리" href="#feedback" />
          <ListRow variant="quiet-value" label="앱 버전" value="0.1.0" />
          <ListRow
            variant="quiet-action"
            label="로그아웃"
            onAction={() => setDialogOpen(true)}
          />
        </div>
      </Section>
      <Section id="actions" title="Action Bar · 4상태">
        <ActionBar
          onSkip={() => notify("skip")}
          onLike={() => notify("like")}
        />
        <ActionBar state="disabled" />
        <ActionBar
          state="sheet"
          onSkip={() => notify("skip")}
          onLike={() => notify("like")}
        />
        <ActionBar state="unlike" onUnlike={() => notify("skip")} />
      </Section>
      <Section id="cards" title="Issue Card · 4상태">
        <p className="text-label text-muted">
          디자인 스펙에 담긴 예시 뉴스입니다.
        </p>
        <IssueCard
          state="basic"
          topic={exampleIssue.topic}
          title={exampleIssue.title}
          articleCount={exampleIssue.articleCount}
          onOpen={() => setSheetOpen(true)}
        />
        <Button
          variant="secondary"
          onClick={() => setRevealKey((value) => value + 1)}
        >
          요약 등장 애니메이션 다시 보기
        </Button>
        <IssueCard
          key={revealKey}
          state="revealing"
          {...exampleIssue}
          onOpen={() => setSheetOpen(true)}
        />
        <IssueCard
          state="summary"
          {...exampleIssue}
          onOpen={() => setSheetOpen(true)}
        />
        <IssueCard state="skeleton" />
      </Section>
      <Section id="feedback" title="피드백 · 오버레이">
        <div className="flex flex-wrap gap-2">
          <OverlayLabel type="like" />
          <OverlayLabel type="skip" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => notify("like")}>
            관심 토스트
          </Button>
          <Button variant="secondary" onClick={() => notify("skip")}>
            넘기기 토스트
          </Button>
        </div>
        <Button onClick={() => setSheetOpen(true)}>바텀시트 열기</Button>
        <Button variant="ghost" onClick={() => setDialogOpen(true)}>
          다이얼로그 열기
        </Button>
        <SheetHandle />
      </Section>
      <Section id="device" title="기기 UI · 디자인 참고용">
        <p className="text-caption text-muted">
          상태바와 홈 인디케이터는 실제 서비스 화면에 추가하지 않습니다.
        </p>
        <StatusBar />
        <HomeIndicator />
      </Section>
      <Toast
        key={toast.key}
        type={toast.type}
        open={toastOpen}
        onOpenChange={setToastOpen}
      />
      <BottomSheet
        title="3줄 요약"
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        footer={
          <Button fullWidth onClick={() => setSheetOpen(false)}>
            확인
          </Button>
        }
      >
        <ol className="flex flex-col gap-4">
          {exampleIssue.summary.map((line, index) => (
            <li key={line} className="flex gap-2.5">
              <NumberBadge value={index + 1} aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ol>
      </BottomSheet>
      <Dialog
        title="로그아웃할까요?"
        description="다시 로그인하면 관심 이슈를 볼 수 있어요."
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
                notify("skip");
              }}
            >
              로그아웃
            </Button>
          </div>
        }
      >
        <p>컴포넌트 예시이며 실제 계정 상태는 변경되지 않습니다.</p>
      </Dialog>
    </div>
  );
}
