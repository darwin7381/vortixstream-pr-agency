import svgPaths from "./svg-hgr0xn8cao";
import imgCompanyLogo from "figma:asset/02c3e5f2002e51a1d0215f19a569aa7fce8ebe6a.png";
import imgPlaceholderImage from "figma:asset/d568b164c26b35eebe6a407c03f478bc8049c84b.png";
import imgCard from "figma:asset/d50ffb0afa333613e155822dc6b3dfe63f150a74.png";

function CompanyLogo() {
  return (
    <div
      className="bg-center bg-contain bg-no-repeat h-11 shrink-0 w-[84px]"
      data-name="Company Logo"
      style={{ backgroundImage: `url('${imgCompanyLogo}')` }}
    />
  );
}

function Content() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start p-0 relative shrink-0"
      data-name="Content"
    >
      <CompanyLogo />
    </div>
  );
}

function Close() {
  return (
    <div className="relative shrink-0 size-6" data-name="close">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="close">
          <path
            d={svgPaths.p837bc40}
            fill="var(--fill-0, white)"
            id="Vector"
            stroke="var(--stroke-0, white)"
          />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 size-12"
      data-name="Icon"
    >
      <Close />
    </div>
  );
}

function Container() {
  return (
    <div className="h-16 relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row h-16 items-center justify-between pl-5 pr-3 py-0 relative w-full">
          <Content />
          <Icon />
        </div>
      </div>
    </div>
  );
}

function Navbar1() {
  return (
    <div
      className="bg-[#000000] box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Navbar / 1 /"
    >
      <Container />
    </div>
  );
}

function TaglineWrapper() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Tagline Wrapper"
    >
      <div
        className="font-['Noto_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          Join The Leading News Distribution Network
        </p>
      </div>
    </div>
  );
}

function Content1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-left w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[40px] tracking-[-0.4px] w-full">
        <p className="block leading-[1.2]">
          Become a VortixPR Publishing Partner
        </p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[12px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Expand your content offerings and generate additional revenue through
          our automated news syndication platform. Connect with premium news
          sources and keep your audience informed with the latest industry
          updates.
        </p>
      </div>
    </div>
  );
}

function SectionTitle() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Section Title"
    >
      <TaglineWrapper />
      <Content1 />
    </div>
  );
}

function Button() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-6 py-2.5 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-lg"
      />
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Join Our Network</p>
      </div>
    </div>
  );
}

function ChevronRight() {
  return (
    <div className="relative shrink-0 size-6" data-name="chevron_right">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="chevron_right">
          <path
            d={svgPaths.p116eba00}
            fill="var(--fill-0, white)"
            id="Vector"
            stroke="var(--stroke-0, white)"
          />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Learn More</p>
      </div>
      <ChevronRight />
    </div>
  );
}

function Actions() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-6 items-center justify-start p-0 relative shrink-0"
      data-name="Actions"
    >
      <Button />
      <Button1 />
    </div>
  );
}

function Content2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <SectionTitle />
      <Actions />
    </div>
  );
}

function Stat() {
  return (
    <div className="relative shrink-0 w-full" data-name="Stat">
      <div
        aria-hidden="true"
        className="absolute border-[#ffffff] border-[0px_0px_0px_2px] border-solid inset-0 pointer-events-none"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start leading-[0] pl-8 pr-0 py-0 relative text-[#ffffff] text-left w-full">
          <div
            className="font-['Roboto:Bold',_sans-serif] font-bold relative shrink-0 text-[56px] w-full"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            <p className="block leading-[1.3]">500+</p>
          </div>
          <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[18px] tracking-[-0.18px] w-full">
            <p className="block leading-[1.4]">Active Publishers</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Stat">
      <div
        aria-hidden="true"
        className="absolute border-[#ffffff] border-[0px_0px_0px_2px] border-solid inset-0 pointer-events-none"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start leading-[0] pl-8 pr-0 py-0 relative text-[#ffffff] text-left w-full">
          <div
            className="font-['Roboto:Bold',_sans-serif] font-bold relative shrink-0 text-[56px] w-full"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            <p className="block leading-[1.3]">50M+</p>
          </div>
          <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[18px] tracking-[-0.18px] w-full">
            <p className="block leading-[1.4]">Monthly Impressions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Stat">
      <div
        aria-hidden="true"
        className="absolute border-[#ffffff] border-[0px_0px_0px_2px] border-solid inset-0 pointer-events-none"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start leading-[0] pl-8 pr-0 py-0 relative text-[#ffffff] text-left w-full">
          <div
            className="font-['Roboto:Bold',_sans-serif] font-bold relative shrink-0 text-[56px] w-full"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            <p className="block leading-[1.3]">24/7</p>
          </div>
          <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[18px] tracking-[-0.18px] w-full">
            <p className="block leading-[1.4]">Content Stream</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Stat">
      <div
        aria-hidden="true"
        className="absolute border-[#ffffff] border-[0px_0px_0px_2px] border-solid inset-0 pointer-events-none"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start leading-[0] pl-8 pr-0 py-0 relative text-[#ffffff] text-left w-full">
          <div
            className="font-['Roboto:Bold',_sans-serif] font-bold relative shrink-0 text-[56px] w-full"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            <p className="block leading-[1.3]">99.9%</p>
          </div>
          <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[18px] tracking-[-0.18px] w-full">
            <p className="block leading-[1.4]">Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-8 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Row"
    >
      <Stat />
      <Stat1 />
      <Stat2 />
      <Stat3 />
    </div>
  );
}

function Stat4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Stat">
      <div
        aria-hidden="true"
        className="absolute border-[#ffffff] border-[0px_0px_0px_2px] border-solid inset-0 pointer-events-none"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start leading-[0] pl-8 pr-0 py-0 relative text-[#ffffff] text-left w-full">
          <div
            className="font-['Roboto:Bold',_sans-serif] font-bold relative shrink-0 text-[56px] w-full"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            <p className="block leading-[1.3]">50%</p>
          </div>
          <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[18px] tracking-[-0.18px] w-full">
            <p className="block leading-[1.4]">Short heading goes here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-8 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Row"
    >
      {[...Array(2).keys()].map((_, i) => (
        <Stat4 key={i} />
      ))}
    </div>
  );
}

function Stats() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-8 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Stats"
    >
      <Row />
      <Row1 />
    </div>
  );
}

function Content3() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Content2 />
      <Stats />
    </div>
  );
}

function Container1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-start justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Content3 />
    </div>
  );
}

function Stats17() {
  return (
    <div
      className="bg-[#4c4c4c] relative shrink-0 w-full"
      data-name="Stats / 17 /"
    >
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-12 items-start justify-start px-5 py-16 relative w-full">
          <Container1 />
        </div>
      </div>
    </div>
  );
}

function PlaceholderLogo() {
  return (
    <div
      className="h-14 relative shrink-0 w-[140px]"
      data-name="Placeholder Logo"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 140 56"
      >
        <g id="Placeholder Logo">
          <g id="Logo">
            <path
              clipRule="evenodd"
              d={svgPaths.pa2af180}
              fill="var(--fill-0, white)"
              fillRule="evenodd"
            />
            <path d={svgPaths.p17de2200} fill="var(--fill-0, white)" />
            <path
              clipRule="evenodd"
              d={svgPaths.p13bdce00}
              fill="var(--fill-0, white)"
              fillRule="evenodd"
            />
            <path d={svgPaths.p28c4400} fill="var(--fill-0, white)" />
            <path
              clipRule="evenodd"
              d={svgPaths.p240e7470}
              fill="var(--fill-0, white)"
              fillRule="evenodd"
            />
            <path d={svgPaths.p29af83f0} fill="var(--fill-0, white)" />
            <path
              clipRule="evenodd"
              d={svgPaths.p3e155c00}
              fill="var(--fill-0, white)"
              fillRule="evenodd"
            />
            <path d={svgPaths.p2759ce70} fill="var(--fill-0, white)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function PlaceholderLogo1() {
  return (
    <div
      className="h-14 relative shrink-0 w-[140px]"
      data-name="Placeholder Logo"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 140 56"
      >
        <g id="Placeholder Logo">
          <path
            clipRule="evenodd"
            d={svgPaths.p36cda200}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Logo"
          />
        </g>
      </svg>
    </div>
  );
}

function Content4() {
  return (
    <div
      className="[flex-flow:wrap] box-border content-center flex gap-8 items-center justify-center px-0 py-2 relative shrink-0 w-full"
      data-name="Content"
    >
      <PlaceholderLogo />
      <PlaceholderLogo1 />
      <PlaceholderLogo />
      <PlaceholderLogo1 />
      <PlaceholderLogo />
      <PlaceholderLogo1 />
      <PlaceholderLogo />
      <PlaceholderLogo1 />
      <PlaceholderLogo />
      <PlaceholderLogo1 />
      <PlaceholderLogo />
    </div>
  );
}

function Container2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-center justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div
        className="font-['Noto_Sans:Bold',_sans-serif] font-bold leading-[0] max-w-[560px] relative shrink-0 text-[#ffffff] text-[12px] text-center w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">{`Trusted by the world's leading media organizations`}</p>
      </div>
      <Content4 />
    </div>
  );
}

function Logo1() {
  return (
    <div
      className="bg-[#000000] relative shrink-0 w-full"
      data-name="Logo / 1 /"
    >
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-6 items-center justify-start px-5 py-12 relative w-full">
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-center justify-start leading-[0] max-w-[768px] p-0 relative shrink-0 text-[#ffffff] text-center w-full"
      data-name="Component"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[44px] tracking-[-0.44px] w-full">
        <p className="block leading-[1.2]">Why Partner with VortixPR?</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[12px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Our platform offers everything you need to enhance your content
          strategy and grow your revenue streams.
        </p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-center justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Component />
    </div>
  );
}

function Header64() {
  return (
    <div
      className="bg-[#000000] relative shrink-0 w-full"
      data-name="Header / 64 /"
    >
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-12 items-center justify-start px-5 py-16 relative w-full">
          <Container3 />
        </div>
      </div>
    </div>
  );
}

function Relume() {
  return (
    <div className="relative shrink-0 size-12" data-name="Relume">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 48 48"
      >
        <g id="Relume">
          <path
            clipRule="evenodd"
            d={svgPaths.p29729300}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Content5() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Relume />
      <div
        className="font-['Space_Grotesk:Medium',_sans-serif] font-medium leading-[0] min-w-full relative shrink-0 text-[#ffffff] text-[20px] text-left tracking-[-0.2px]"
        style={{ width: "min-content" }}
      >
        <p className="block leading-[1.4]">Monetize Your Content</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] min-w-full relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{
          fontVariationSettings: "'CTGR' 0, 'wdth' 100",
          width: "min-content",
        }}
      >
        <p className="block leading-[1.5]">
          Generate revenue through our premium content syndication network with
          competitive payout rates.
        </p>
      </div>
    </div>
  );
}

function ChevronRight1() {
  return (
    <div className="relative shrink-0 size-6" data-name="chevron_right">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="chevron_right">
          <path
            d={svgPaths.p116eba00}
            fill="var(--fill-0, white)"
            id="Vector"
            stroke="var(--stroke-0, white)"
          />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip p-0 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Button</p>
      </div>
      <ChevronRight1 />
    </div>
  );
}

function Action() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Action"
    >
      <Button2 />
    </div>
  );
}

function ListItem() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Content5 />
      <Action />
    </div>
  );
}

function Relume1() {
  return (
    <div className="relative shrink-0 size-12" data-name="Relume">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 48 48"
      >
        <g id="Relume">
          <path
            clipRule="evenodd"
            d={svgPaths.p29729300}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Content6() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Relume1 />
      <div
        className="font-['Space_Grotesk:Medium',_sans-serif] font-medium leading-[0] min-w-full relative shrink-0 text-[#ffffff] text-[20px] text-left tracking-[-0.2px]"
        style={{ width: "min-content" }}
      >
        <p className="block leading-[1.4]">Boost Your Reach</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] min-w-full relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{
          fontVariationSettings: "'CTGR' 0, 'wdth' 100",
          width: "min-content",
        }}
      >
        <p className="block leading-[1.5]">
          Access high-quality news content that keeps your audience engaged and
          coming back for more.
        </p>
      </div>
    </div>
  );
}

function ChevronRight2() {
  return (
    <div className="relative shrink-0 size-6" data-name="chevron_right">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="chevron_right">
          <path
            d={svgPaths.p116eba00}
            fill="var(--fill-0, white)"
            id="Vector"
            stroke="var(--stroke-0, white)"
          />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip p-0 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Button</p>
      </div>
      <ChevronRight2 />
    </div>
  );
}

function Action1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Action"
    >
      <Button3 />
    </div>
  );
}

function ListItem1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Content6 />
      <Action1 />
    </div>
  );
}

function Relume2() {
  return (
    <div className="relative shrink-0 size-12" data-name="Relume">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 48 48"
      >
        <g id="Relume">
          <path
            clipRule="evenodd"
            d={svgPaths.p29729300}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Content7() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Relume2 />
      <div
        className="font-['Space_Grotesk:Medium',_sans-serif] font-medium leading-[0] min-w-full relative shrink-0 text-[#ffffff] text-[20px] text-left tracking-[-0.2px]"
        style={{ width: "min-content" }}
      >
        <p className="block leading-[1.4]">Quality Assurance</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] min-w-full relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{
          fontVariationSettings: "'CTGR' 0, 'wdth' 100",
          width: "min-content",
        }}
      >
        <p className="block leading-[1.5]">
          All content goes through our rigorous editorial review process to
          ensure accuracy and relevance.
        </p>
      </div>
    </div>
  );
}

function ChevronRight3() {
  return (
    <div className="relative shrink-0 size-6" data-name="chevron_right">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="chevron_right">
          <path
            d={svgPaths.p116eba00}
            fill="var(--fill-0, white)"
            id="Vector"
            stroke="var(--stroke-0, white)"
          />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip p-0 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Button</p>
      </div>
      <ChevronRight3 />
    </div>
  );
}

function Action2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Action"
    >
      <Button4 />
    </div>
  );
}

function ListItem2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Content7 />
      <Action2 />
    </div>
  );
}

function Relume3() {
  return (
    <div className="relative shrink-0 size-12" data-name="Relume">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 48 48"
      >
        <g id="Relume">
          <path
            clipRule="evenodd"
            d={svgPaths.p29729300}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Content8() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Relume3 />
      <div
        className="font-['Space_Grotesk:Medium',_sans-serif] font-medium leading-[0] min-w-full relative shrink-0 text-[#ffffff] text-[20px] text-left tracking-[-0.2px]"
        style={{ width: "min-content" }}
      >
        <p className="block leading-[1.4]">Global Network</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] min-w-full relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{
          fontVariationSettings: "'CTGR' 0, 'wdth' 100",
          width: "min-content",
        }}
      >
        <p className="block leading-[1.5]">
          Join a worldwide network of trusted publishers and media
          organizations.
        </p>
      </div>
    </div>
  );
}

function ChevronRight4() {
  return (
    <div className="relative shrink-0 size-6" data-name="chevron_right">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="chevron_right">
          <path
            d={svgPaths.p116eba00}
            fill="var(--fill-0, white)"
            id="Vector"
            stroke="var(--stroke-0, white)"
          />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip p-0 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Button</p>
      </div>
      <ChevronRight4 />
    </div>
  );
}

function Action3() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Action"
    >
      <Button5 />
    </div>
  );
}

function ListItem3() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Content8 />
      <Action3 />
    </div>
  );
}

function List() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List"
    >
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
    </div>
  );
}

function Relume4() {
  return (
    <div className="relative shrink-0 size-12" data-name="Relume">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 48 48"
      >
        <g id="Relume">
          <path
            clipRule="evenodd"
            d={svgPaths.p29729300}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Content9() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Relume4 />
      <div
        className="font-['Space_Grotesk:Medium',_sans-serif] font-medium leading-[0] min-w-full relative shrink-0 text-[#ffffff] text-[20px] text-left tracking-[-0.2px]"
        style={{ width: "min-content" }}
      >
        <p className="block leading-[1.4]">Short heading here</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] min-w-full relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{
          fontVariationSettings: "'CTGR' 0, 'wdth' 100",
          width: "min-content",
        }}
      >
        <p className="block leading-[1.5]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          varius enim in eros.
        </p>
      </div>
    </div>
  );
}

function ChevronRight5() {
  return (
    <div className="relative shrink-0 size-6" data-name="chevron_right">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="chevron_right">
          <path
            d={svgPaths.p116eba00}
            fill="var(--fill-0, white)"
            id="Vector"
            stroke="var(--stroke-0, white)"
          />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip p-0 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Button</p>
      </div>
      <ChevronRight5 />
    </div>
  );
}

function Action4() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Action"
    >
      <Button6 />
    </div>
  );
}

function ListItem4() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Content9 />
      <Action4 />
    </div>
  );
}

function List1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List"
    >
      {[...Array(2).keys()].map((_, i) => (
        <ListItem4 key={i} />
      ))}
    </div>
  );
}

function ListWrapper() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="List Wrapper"
    >
      <List />
      <List1 />
    </div>
  );
}

function Component1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Component"
    >
      <ListWrapper />
      <div
        className="aspect-[335/348] bg-center bg-cover bg-no-repeat rounded-2xl shrink-0 w-full"
        data-name="Placeholder Image"
        style={{ backgroundImage: `url('${imgPlaceholderImage}')` }}
      />
    </div>
  );
}

function Container4() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-start justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Component1 />
    </div>
  );
}

function Layout222() {
  return (
    <div
      className="bg-[#000000] relative shrink-0 w-full"
      data-name="Layout / 222 /"
    >
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-12 items-center justify-start px-5 py-16 relative w-full">
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Content11() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-left w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[32px] tracking-[-0.32px] w-full">
        <p className="block leading-[1.2]">Everything You Need to Succeed</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[12px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Our comprehensive platform provides all the tools and features you
          need to integrate seamlessly with your existing content strategy.
        </p>
      </div>
    </div>
  );
}

function Relume6() {
  return (
    <div className="relative shrink-0 size-4" data-name="Relume">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g id="Relume">
          <path
            clipRule="evenodd"
            d={svgPaths.p24ff3080}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem6() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Relume6 />
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Easy-to-use publisher dashboard</p>
      </div>
    </div>
  );
}

function Relume7() {
  return (
    <div className="relative shrink-0 size-4" data-name="Relume">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g id="Relume">
          <path
            clipRule="evenodd"
            d={svgPaths.p24ff3080}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem7() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Relume7 />
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Flexible payment options</p>
      </div>
    </div>
  );
}

function Relume8() {
  return (
    <div className="relative shrink-0 size-4" data-name="Relume">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g id="Relume">
          <path
            clipRule="evenodd"
            d={svgPaths.p24ff3080}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem8() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Relume8 />
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Custom content filtering</p>
      </div>
    </div>
  );
}

function Relume9() {
  return (
    <div className="relative shrink-0 size-4" data-name="Relume">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 16 16"
      >
        <g id="Relume">
          <path
            clipRule="evenodd"
            d={svgPaths.p24ff3080}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem9() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Relume9 />
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">API integration available</p>
      </div>
    </div>
  );
}

function List2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="List"
    >
      <ListItem6 />
      <ListItem7 />
      <ListItem8 />
      <ListItem9 />
    </div>
  );
}

function Content12() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Content11 />
      <List2 />
    </div>
  );
}

function Component2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Component"
    >
      <Content12 />
      <div
        className="aspect-[335/348] bg-center bg-cover bg-no-repeat rounded-2xl shrink-0 w-full"
        data-name="Placeholder Image"
        style={{ backgroundImage: `url('${imgPlaceholderImage}')` }}
      />
    </div>
  );
}

function Container5() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-start justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Component2 />
    </div>
  );
}

function Layout18() {
  return (
    <div
      className="bg-[#000000] relative shrink-0 w-full"
      data-name="Layout / 18 /"
    >
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-12 items-center justify-start px-5 py-16 relative w-full">
          <Container5 />
        </div>
      </div>
    </div>
  );
}

function TaglineWrapper1() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0"
      data-name="Tagline Wrapper"
    >
      <div
        className="font-['Noto_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Payments</p>
      </div>
    </div>
  );
}

function Content13() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-left w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[40px] tracking-[-0.4px] w-full">
        <p className="block leading-[1.2]">
          Flexible Payment Options for Publishers
        </p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[12px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Choose how you want to receive your payments. We support both
          traditional fiat currencies through PayPal and cryptocurrency payments
          directly to your wallet.
        </p>
      </div>
    </div>
  );
}

function SectionTitle1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Section Title"
    >
      <TaglineWrapper1 />
      <Content13 />
    </div>
  );
}

function Relume10() {
  return (
    <div className="relative shrink-0 size-6" data-name="Relume">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Relume">
          <path
            clipRule="evenodd"
            d={svgPaths.p119cd700}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem10() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Relume10 />
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">PayPal</p>
      </div>
    </div>
  );
}

function Relume11() {
  return (
    <div className="relative shrink-0 size-6" data-name="Relume">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Relume">
          <path
            clipRule="evenodd"
            d={svgPaths.p119cd700}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem11() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Relume11 />
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Bitcoin</p>
      </div>
    </div>
  );
}

function Relume12() {
  return (
    <div className="relative shrink-0 size-6" data-name="Relume">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Relume">
          <path
            clipRule="evenodd"
            d={svgPaths.p119cd700}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem12() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Relume12 />
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Ethereum</p>
      </div>
    </div>
  );
}

function List3() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="List"
    >
      <ListItem10 />
      <ListItem11 />
      <ListItem12 />
    </div>
  );
}

function Content14() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <SectionTitle1 />
      <List3 />
    </div>
  );
}

function Button8() {
  return (
    <div className="relative rounded-md shrink-0" data-name="Button">
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip px-6 py-2.5 relative">
        <div
          className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
          style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
        >
          <p className="block leading-[1.5] whitespace-pre">Learn More</p>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-lg"
      />
    </div>
  );
}

function ChevronRight7() {
  return (
    <div className="relative shrink-0 size-6" data-name="chevron_right">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="chevron_right">
          <path
            d={svgPaths.p116eba00}
            fill="var(--fill-0, white)"
            id="Vector"
            stroke="var(--stroke-0, white)"
          />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip p-0 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Get Started</p>
      </div>
      <ChevronRight7 />
    </div>
  );
}

function Actions1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-6 items-center justify-start p-0 relative shrink-0"
      data-name="Actions"
    >
      <Button8 />
      <Button9 />
    </div>
  );
}

function Content15() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Content14 />
      <Actions1 />
    </div>
  );
}

function Component3() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Component"
    >
      <Content15 />
      <div
        className="aspect-[335/348] bg-center bg-cover bg-no-repeat rounded-2xl shrink-0 w-full"
        data-name="Placeholder Image"
        style={{ backgroundImage: `url('${imgPlaceholderImage}')` }}
      />
    </div>
  );
}

function Container6() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-start justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Component3 />
    </div>
  );
}

function Layout207() {
  return (
    <div
      className="bg-[#000000] relative shrink-0 w-full"
      data-name="Layout / 207 /"
    >
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-12 items-center justify-start px-5 py-16 relative w-full">
          <Container6 />
        </div>
      </div>
    </div>
  );
}

function Content16() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-left w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[40px] tracking-[-0.4px] w-full">
        <p className="block leading-[1.2]">{`Ready to Join VortixPR's Publisher Network?`}</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[12px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Start monetizing your content today. Sign up takes less than 5 minutes
          and gives you instant access to our content distribution platform.
        </p>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-6 py-2.5 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#ff7400] border-solid inset-[-1px] pointer-events-none rounded-[7px]"
      />
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          Become a Publisher Partner
        </p>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-6 py-2.5 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-lg"
      />
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Contact Sales Team</p>
      </div>
    </div>
  );
}

function Actions2() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0"
      data-name="Actions"
    >
      <Button10 />
      <Button11 />
    </div>
  );
}

function Column() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-6 grow items-start justify-start max-w-[768px] min-h-px min-w-px p-0 relative shrink-0"
      data-name="Column"
    >
      <Content16 />
      <Actions2 />
    </div>
  );
}

function Card() {
  return (
    <div
      className="bg-[#00000080] bg-[position:0%_0%,_50%_50%] bg-size-[auto,cover] relative rounded-2xl shrink-0 w-full"
      data-name="Card"
      style={{ backgroundImage: `url('${imgCard}')` }}
    >
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row items-start justify-start p-[32px] relative w-full">
          <Column />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border border-[#ffffff] border-solid inset-0 pointer-events-none rounded-2xl"
      />
    </div>
  );
}

function Container7() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-start justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Card />
    </div>
  );
}

function Cta41() {
  return (
    <div
      className="bg-[#000000] relative shrink-0 w-full"
      data-name="CTA / 41 /"
    >
      <div className="overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-12 items-start justify-start px-5 py-16 relative w-full">
          <Container7 />
        </div>
      </div>
    </div>
  );
}

function CompanyLogo1() {
  return (
    <div
      className="bg-center bg-contain bg-no-repeat h-11 shrink-0 w-[84px]"
      data-name="Company Logo"
      style={{ backgroundImage: `url('${imgCompanyLogo}')` }}
    />
  );
}

function TextInput() {
  return (
    <div
      className="bg-[rgba(255,255,255,0)] relative rounded-md shrink-0 w-full"
      data-name="Text input"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-lg"
      />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 relative w-full">
          <div
            className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[12px] text-[rgba(255,255,255,0.6)] text-left"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          >
            <p className="block leading-[1.5]">Enter your email</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="relative rounded-md shrink-0 w-full" data-name="Button">
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-lg"
      />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-6 py-2.5 relative w-full">
          <div
            className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          >
            <p className="block leading-[1.5] whitespace-pre">Subscribe</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Form"
    >
      <TextInput />
      <Button12 />
    </div>
  );
}

function Actions3() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Actions"
    >
      <Form />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[0px] text-left w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="leading-[1.5]">
          <span className="text-[10px]">{`By subscribing you agree to with our `}</span>
          <span
            className="[text-decoration-line:underline] [text-decoration-skip-ink:none] [text-decoration-style:solid] [text-underline-position:from-font] font-['Noto_Sans:Regular',_sans-serif] font-normal text-[12px]"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          >
            Privacy Policy
          </span>
          <span className="text-[10px]">{` and provide consent to receive updates from our company.`}</span>
        </p>
      </div>
    </div>
  );
}

function Newsletter() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Newsletter"
    >
      <CompanyLogo1 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] min-w-full relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{
          fontVariationSettings: "'CTGR' 0, 'wdth' 100",
          width: "min-content",
        }}
      >
        <p className="block leading-[1.5]">
          Join our newsletter to stay up to date on features and releases.
        </p>
      </div>
      <Actions3 />
    </div>
  );
}

function Link() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Homepage</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Services</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Pricing</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Our Clients</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Get a Quote</p>
      </div>
    </div>
  );
}

function FooterLinks() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Footer Links"
    >
      <Link />
      <Link1 />
      <Link2 />
      <Link3 />
      <Link4 />
    </div>
  );
}

function Column1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Column"
    >
      <div
        className="font-['Noto_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Map</p>
      </div>
      <FooterLinks />
    </div>
  );
}

function Link5() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Link Six</p>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Link Seven</p>
      </div>
    </div>
  );
}

function Link7() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Link Eight</p>
      </div>
    </div>
  );
}

function Link8() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Link Nine</p>
      </div>
    </div>
  );
}

function Link9() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Link Ten</p>
      </div>
    </div>
  );
}

function FooterLinks1() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Footer Links"
    >
      <Link5 />
      <Link6 />
      <Link7 />
      <Link8 />
      <Link9 />
    </div>
  );
}

function Column2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Column"
    >
      <div
        className="font-['Noto_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">News Category</p>
      </div>
      <FooterLinks1 />
    </div>
  );
}

function Facebook() {
  return (
    <div className="relative shrink-0 size-6" data-name="Facebook">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Facebook">
          <path
            d={svgPaths.p2ed8fe00}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Link10() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <Facebook />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Facebook</p>
      </div>
    </div>
  );
}

function Instagram() {
  return (
    <div className="relative shrink-0 size-6" data-name="Instagram">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Instagram">
          <path
            clipRule="evenodd"
            d={svgPaths.p3f3f55f0}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Link11() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <Instagram />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Instagram</p>
      </div>
    </div>
  );
}

function X() {
  return (
    <div className="relative shrink-0 size-6" data-name="X">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="X">
          <path
            d={svgPaths.p214d7500}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Link12() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <X />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">X</p>
      </div>
    </div>
  );
}

function LinkedIn() {
  return (
    <div className="relative shrink-0 size-6" data-name="LinkedIn">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="LinkedIn">
          <path
            clipRule="evenodd"
            d={svgPaths.p2b170900}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Link13() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <LinkedIn />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">LinkedIn</p>
      </div>
    </div>
  );
}

function Youtube() {
  return (
    <div className="relative shrink-0 size-6" data-name="Youtube">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Youtube">
          <path
            d={svgPaths.p35f23f00}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Link14() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <Youtube />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Youtube</p>
      </div>
    </div>
  );
}

function SocialLinks() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Social Links"
    >
      <Link10 />
      <Link11 />
      <Link12 />
      <Link13 />
      <Link14 />
    </div>
  );
}

function Column3() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Column"
    >
      <div
        className="font-['Noto_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Follow Us</p>
      </div>
      <SocialLinks />
    </div>
  );
}

function Links() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-10 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Links"
    >
      <Column1 />
      <Column2 />
      <Column3 />
    </div>
  );
}

function Content17() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Newsletter />
      <Links />
    </div>
  );
}

function FooterLinks2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0"
      data-name="Footer Links"
    >
      <div
        className="relative shrink-0"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="[text-decoration-line:underline] [text-decoration-skip-ink:none] [text-decoration-style:solid] [text-underline-position:from-font] block leading-[1.5] text-nowrap whitespace-pre">
          Editorial Policy
        </p>
      </div>
      <div
        className="relative shrink-0"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="[text-decoration-line:underline] [text-decoration-skip-ink:none] [text-decoration-style:solid] [text-underline-position:from-font] block leading-[1.5] text-nowrap whitespace-pre">
          Privacy Policy
        </p>
      </div>
      <div
        className="relative shrink-0"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="[text-decoration-line:underline] [text-decoration-skip-ink:none] [text-decoration-style:solid] [text-underline-position:from-font] block leading-[1.5] text-nowrap whitespace-pre">
          Terms of Service
        </p>
      </div>
      <div
        className="relative shrink-0"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="[text-decoration-line:underline] [text-decoration-skip-ink:none] [text-decoration-style:solid] [text-underline-position:from-font] block leading-[1.5] text-nowrap whitespace-pre">
          Credit Card Policy
        </p>
      </div>
      <div
        className="relative shrink-0"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="[text-decoration-line:underline] [text-decoration-skip-ink:none] [text-decoration-style:solid] [text-underline-position:from-font] block leading-[1.5] text-nowrap whitespace-pre">
          Cookies Settings
        </p>
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div
      className="box-border content-stretch flex flex-col font-['Noto_Sans:Regular',_sans-serif] font-normal gap-8 items-start justify-start leading-[0] pb-4 pt-0 px-0 relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap w-full"
      data-name="Row"
    >
      <FooterLinks2 />
      <div
        className="relative shrink-0"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] text-nowrap whitespace-pre">
          © 2025 VertixStream. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function Credits() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Credits"
    >
      <div className="h-0 relative shrink-0 w-full" data-name="Divider">
        <div
          className="absolute bottom-0 left-0 right-0 top-[-2px]"
          style={
            { "--stroke-0": "rgba(255, 255, 255, 1)" } as React.CSSProperties
          }
        >
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            role="presentation"
            viewBox="0 0 335 2"
          >
            <line
              id="Divider"
              stroke="var(--stroke-0, white)"
              strokeWidth="2"
              x2="335"
              y1="1"
              y2="1"
            />
          </svg>
        </div>
      </div>
      <Row2 />
    </div>
  );
}

function Container8() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-start justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Content17 />
      <Credits />
    </div>
  );
}

function Footer1() {
  return (
    <div
      className="bg-[#000000] relative shrink-0 w-full"
      data-name="Footer / 1 /"
    >
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-12 items-center justify-start px-5 py-12 relative w-full">
          <Container8 />
        </div>
      </div>
    </div>
  );
}

export default function PublisherMobile() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative size-full"
      data-name="Publisher • Mobile"
    >
      <Navbar1 />
      <Stats17 />
      <Logo1 />
      <Header64 />
      <Layout222 />
      <Layout18 />
      <Layout207 />
      <Cta41 />
      <Footer1 />
    </div>
  );
}