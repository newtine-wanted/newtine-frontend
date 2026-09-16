import { AccountHeader } from "./account-header";
import { AccountSection } from "./account-section";
import { getInterestSummary } from "./interest-summary";
import { InterestSection } from "./interest-section";
import { MY_PAGE_MOCK } from "./mock-data";
import { ShortcutTiles } from "./shortcut-tiles";

export function MyPage() {
  const { account, interest, likedNewsCount, swipeCount, appVersion } =
    MY_PAGE_MOCK;
  const summary = getInterestSummary(
    interest.likeCounts,
    interest.sampleThreshold,
  );

  return (
    <div className="flex flex-col gap-4.5 px-5 pt-4 pb-6">
      <AccountHeader account={account} />
      <ShortcutTiles likedNewsCount={likedNewsCount} />
      <InterestSection periodDays={interest.periodDays} summary={summary} />
      <AccountSection
        appVersion={appVersion}
        likedCount={likedNewsCount}
        swipeCount={swipeCount}
      />
    </div>
  );
}
