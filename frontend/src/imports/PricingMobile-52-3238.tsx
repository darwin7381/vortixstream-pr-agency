import svgPaths from "./svg-wcrobessnd";
import imgCompanyLogo from "figma:asset/02c3e5f2002e51a1d0215f19a569aa7fce8ebe6a.png";
import imgCard from "figma:asset/3f8b70b6cdfe9ef6ed25dae5d47b67bb81b754da.png";

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
      className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0"
      data-name="Tagline Wrapper"
    >
      <div
        className="font-['Noto_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Princing</p>
      </div>
    </div>
  );
}

function Content1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-center justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-center w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[40px] tracking-[-0.4px] w-full">
        <p className="block leading-[1.2]">Choose Your Perfect Plan</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[12px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          From startups to enterprises, we have the right package to amplify
          your story and reach your audience.
        </p>
      </div>
    </div>
  );
}

function SectionTitle() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-center justify-start max-w-[768px] p-0 relative shrink-0 w-full"
      data-name="Section Title"
    >
      <TaglineWrapper />
      <Content1 />
    </div>
  );
}

function BlurOn() {
  return (
    <div className="relative shrink-0 size-12" data-name="blur_on">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 48 48"
      >
        <g id="blur_on">
          <path
            d={svgPaths.p35afbb00}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Price() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-left w-full"
      data-name="Price"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[18px] tracking-[-0.18px] w-full">
        <p className="block leading-[1.4]">Lite</p>
      </div>
      <div
        className="font-['Roboto:Bold',_sans-serif] font-bold relative shrink-0 text-[40px] w-full"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="block leading-[1.2]">$999</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[12px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Perfect for startups and small businesses
        </p>
      </div>
    </div>
  );
}

function Content2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-end justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <BlurOn />
      <Price />
    </div>
  );
}

function Check() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          5 Guaranteed Press Release
        </p>
      </div>
    </div>
  );
}

function Check1() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check1 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Same-day delivery</p>
      </div>
    </div>
  );
}

function Check2() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem2() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check2 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          Editorial recommendations
        </p>
      </div>
    </div>
  );
}

function Check3() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem3() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check3 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          Dedicated Support Team
        </p>
      </div>
    </div>
  );
}

function Check4() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem4() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check4 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          SEO Optimization Included
        </p>
      </div>
    </div>
  );
}

function Check5() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem5() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check5 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          Optional add-ons: Multilingual Releases (translation to 10+ languages)
        </p>
      </div>
    </div>
  );
}

function List() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="List"
    >
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
      <ListItem4 />
      <ListItem5 />
    </div>
  );
}

function Content3() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Includes:</p>
      </div>
      <List />
    </div>
  );
}

function Content4() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-8 items-end justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Content2 />
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
            viewBox="0 0 287 2"
          >
            <line
              id="Divider"
              stroke="var(--stroke-0, white)"
              strokeWidth="2"
              x2="287"
              y1="1"
              y2="1"
            />
          </svg>
        </div>
      </div>
      <Content3 />
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-md shrink-0 w-full" data-name="Button">
      <div
        aria-hidden="true"
        className="absolute border border-[#ff7400] border-solid inset-[-1px] pointer-events-none rounded-[7px]"
      />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-6 py-2.5 relative w-full">
          <div
            className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          >
            <p className="block leading-[1.5] whitespace-pre">Get started</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Actions() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Actions"
    >
      <Button />
    </div>
  );
}

function Column() {
  return (
    <div
      className="bg-[#000000] relative rounded-2xl shrink-0 w-full"
      data-name="Column"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-2xl"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-8 items-start justify-start px-6 py-8 relative w-full">
          <Content4 />
          <Actions />
        </div>
      </div>
    </div>
  );
}

function EditorChoice() {
  return (
    <div className="relative shrink-0 size-12" data-name="editor_choice">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 48 48"
      >
        <g id="editor_choice">
          <path
            d={svgPaths.p22e56900}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Price1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-left w-full"
      data-name="Price"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[18px] tracking-[-0.18px] w-full">
        <p className="block leading-[1.4]">Pro</p>
      </div>
      <div
        className="font-['Roboto:Bold',_sans-serif] font-bold relative shrink-0 text-[40px] w-full"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="block leading-[1.2]">$1999</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[12px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Ideal for growing companies</p>
      </div>
    </div>
  );
}

function Content5() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-end justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <EditorChoice />
      <Price1 />
    </div>
  );
}

function Check6() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
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
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check6 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          10 Guaranteed Press Release
        </p>
      </div>
    </div>
  );
}

function Check7() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
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
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check7 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Same-day delivery</p>
      </div>
    </div>
  );
}

function Check8() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
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
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check8 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          Editorial recommendations
        </p>
      </div>
    </div>
  );
}

function Check9() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
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
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check9 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          Dedicated Support Team
        </p>
      </div>
    </div>
  );
}

function Check10() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
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
      <Check10 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          SEO Optimization Included
        </p>
      </div>
    </div>
  );
}

function Check11() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
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
      <Check11 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          Optional add-ons: Global distribution (translation included)
        </p>
      </div>
    </div>
  );
}

function Check12() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
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
      <Check12 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          Optional add-ons: Social Media Promotion
        </p>
      </div>
    </div>
  );
}

function List1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="List"
    >
      <ListItem6 />
      <ListItem7 />
      <ListItem8 />
      <ListItem9 />
      <ListItem10 />
      <ListItem11 />
      <ListItem12 />
    </div>
  );
}

function Content6() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Includes:</p>
      </div>
      <List1 />
    </div>
  );
}

function Content7() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-8 items-end justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Content5 />
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
            viewBox="0 0 287 2"
          >
            <line
              id="Divider"
              stroke="var(--stroke-0, white)"
              strokeWidth="2"
              x2="287"
              y1="1"
              y2="1"
            />
          </svg>
        </div>
      </div>
      <Content6 />
    </div>
  );
}

function Button1() {
  return (
    <div className="relative rounded-md shrink-0 w-full" data-name="Button">
      <div
        aria-hidden="true"
        className="absolute border border-[#ff7400] border-solid inset-[-1px] pointer-events-none rounded-[7px]"
      />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-6 py-2.5 relative w-full">
          <div
            className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          >
            <p className="block leading-[1.5] whitespace-pre">Get started</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Actions1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Actions"
    >
      <Button1 />
    </div>
  );
}

function Column1() {
  return (
    <div
      className="bg-[#000000] relative rounded-2xl shrink-0 w-full"
      data-name="Column"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-2xl"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-8 items-start justify-start px-6 py-8 relative w-full">
          <Content7 />
          <Actions1 />
        </div>
      </div>
    </div>
  );
}

function LensBlur() {
  return (
    <div className="relative shrink-0 size-12" data-name="lens_blur">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 48 48"
      >
        <g id="blur_on">
          <path
            d={svgPaths.p35afbb00}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Price2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-left w-full"
      data-name="Price"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[18px] tracking-[-0.18px] w-full">
        <p className="block leading-[1.4]">Premium</p>
      </div>
      <div
        className="font-['Roboto:Bold',_sans-serif] font-bold relative shrink-0 text-[40px] w-full"
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        <p className="block leading-[1.2]">$5000</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[12px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          For enterprises and large organizations
        </p>
      </div>
    </div>
  );
}

function Content8() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-end justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <LensBlur />
      <Price2 />
    </div>
  );
}

function Check13() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem13() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check13 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          30 Guaranteed Press Release
        </p>
      </div>
    </div>
  );
}

function Check14() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem14() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check14 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Same-day delivery</p>
      </div>
    </div>
  );
}

function Check15() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem15() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check15 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          Editorial recommendations
        </p>
      </div>
    </div>
  );
}

function Check16() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem16() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check16 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          Dedicated Support Team
        </p>
      </div>
    </div>
  );
}

function Check17() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem17() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check17 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          SEO Optimization Included
        </p>
      </div>
    </div>
  );
}

function Check18() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem18() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check18 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          Optional add-ons:Global distribution (translation included)
        </p>
      </div>
    </div>
  );
}

function Check19() {
  return (
    <div className="relative shrink-0 size-6" data-name="Check">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Check">
          <path
            d={svgPaths.p176171c0}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function ListItem19() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Check19 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          Optional add-ons:Social Media Promotion
        </p>
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
      <ListItem13 />
      <ListItem14 />
      <ListItem15 />
      <ListItem16 />
      <ListItem17 />
      <ListItem18 />
      <ListItem19 />
    </div>
  );
}

function Content9() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Includes:</p>
      </div>
      <List2 />
    </div>
  );
}

function Content10() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-8 items-end justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Content8 />
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
            viewBox="0 0 287 2"
          >
            <line
              id="Divider"
              stroke="var(--stroke-0, white)"
              strokeWidth="2"
              x2="287"
              y1="1"
              y2="1"
            />
          </svg>
        </div>
      </div>
      <Content9 />
    </div>
  );
}

function Button2() {
  return (
    <div className="relative rounded-md shrink-0 w-full" data-name="Button">
      <div
        aria-hidden="true"
        className="absolute border border-[#ff7400] border-solid inset-[-1px] pointer-events-none rounded-[7px]"
      />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-6 py-2.5 relative w-full">
          <div
            className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          >
            <p className="block leading-[1.5] whitespace-pre">Get started</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Actions2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Actions"
    >
      <Button2 />
    </div>
  );
}

function Column2() {
  return (
    <div
      className="bg-[#000000] relative rounded-2xl shrink-0 w-full"
      data-name="Column"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-0 pointer-events-none rounded-2xl"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-8 items-start justify-start px-6 py-8 relative w-full">
          <Content10 />
          <Actions2 />
        </div>
      </div>
    </div>
  );
}

function Content11() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-8 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Column />
      <Column1 />
      <Column2 />
    </div>
  );
}

function Container1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-center justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <SectionTitle />
      <Content11 />
    </div>
  );
}

function Pricing19() {
  return (
    <div
      className="bg-[#000000] relative shrink-0 w-full"
      data-name="Pricing / 19 /"
    >
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-12 items-center justify-start px-5 py-16 relative w-full">
          <Container1 />
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-center justify-center px-5 py-0 relative w-full">
          <div
            className="font-['Noto_Sans:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-center w-[375px]"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          >
            <p className="block leading-[1.5]">Featured In Top Media Outlets</p>
          </div>
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

function Content12() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-center justify-start pb-0 pt-4 px-0 relative shrink-0"
      data-name="Content"
    >
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

function Content13() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Content12 />
    </div>
  );
}

function Logo3() {
  return (
    <div
      className="bg-[#000000] box-border content-stretch flex flex-col gap-8 items-start justify-start overflow-clip px-0 py-12 relative shrink-0 w-full"
      data-name="Logo / 3 /"
    >
      <Container2 />
      <Content13 />
    </div>
  );
}

function SectionTitle1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-center justify-start leading-[0] max-w-[768px] p-0 relative shrink-0 text-[#ffffff] text-center w-full"
      data-name="Section Title"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[40px] tracking-[-0.4px] w-full">
        <p className="block leading-[1.2]">FAQs</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[12px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">{`Got questions? We've got answers. Can't find what you're looking for? Contact us.`}</p>
      </div>
    </div>
  );
}

function KeyboardArrowUp() {
  return (
    <div className="relative shrink-0 size-8" data-name="keyboard_arrow_up">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 32 32"
      >
        <g id="keyboard_arrow_up">
          <path
            d={svgPaths.p65f0c80}
            fill="var(--fill-0, white)"
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeWidth="1.33333"
          />
        </g>
      </svg>
    </div>
  );
}

function Question() {
  return (
    <div className="relative shrink-0 w-full" data-name="Question">
      <div className="box-border content-stretch flex flex-row gap-6 items-center justify-start overflow-clip px-0 py-4 relative w-full">
        <div
          className="basis-0 font-['Noto_Sans:Bold',_sans-serif] font-bold grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
          style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
        >
          <p className="block leading-[1.5]">What services do you offer?</p>
        </div>
        <KeyboardArrowUp />
      </div>
      <div
        aria-hidden="true"
        className="absolute border-[#ffffff] border-[2px_0px_0px] border-solid inset-0 pointer-events-none"
      />
    </div>
  );
}

function Answer() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start pb-5 pt-0 px-0 relative shrink-0 w-full"
      data-name="Answer"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          We provide comprehensive Digital PR services tailored for blockchain,
          Web3, and AI projects. Our offerings include media placements,
          campaign launches, and press release distribution. Each service is
          designed to maximize your visibility and impact in the tech landscape.
        </p>
      </div>
    </div>
  );
}

function AccordionItem() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Accordion Item"
    >
      <Question />
      <Answer />
    </div>
  );
}

function KeyboardArrowUp1() {
  return (
    <div className="relative shrink-0 size-8" data-name="keyboard_arrow_up">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 32 32"
      >
        <g id="keyboard_arrow_up">
          <path
            d={svgPaths.p65f0c80}
            fill="var(--fill-0, white)"
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeWidth="1.33333"
          />
        </g>
      </svg>
    </div>
  );
}

function Question1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Question">
      <div className="box-border content-stretch flex flex-row gap-6 items-center justify-start overflow-clip px-0 py-4 relative w-full">
        <div
          className="basis-0 font-['Noto_Sans:Bold',_sans-serif] font-bold grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
          style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
        >
          <p className="block leading-[1.5]">How can I get started?</p>
        </div>
        <KeyboardArrowUp1 />
      </div>
      <div
        aria-hidden="true"
        className="absolute border-[#ffffff] border-[2px_0px_0px] border-solid inset-0 pointer-events-none"
      />
    </div>
  );
}

function Answer1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start pb-5 pt-0 px-0 relative shrink-0 w-full"
      data-name="Answer"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Getting started is easy! Simply reach out through our contact form to
          discuss your project. Our team will guide you through the process and
          help you choose the right service package.
        </p>
      </div>
    </div>
  );
}

function AccordionItem1() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Accordion Item"
    >
      <Question1 />
      <Answer1 />
    </div>
  );
}

function KeyboardArrowUp2() {
  return (
    <div className="relative shrink-0 size-8" data-name="keyboard_arrow_up">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 32 32"
      >
        <g id="keyboard_arrow_up">
          <path
            d={svgPaths.p65f0c80}
            fill="var(--fill-0, white)"
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeWidth="1.33333"
          />
        </g>
      </svg>
    </div>
  );
}

function Question2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Question">
      <div className="box-border content-stretch flex flex-row gap-6 items-center justify-start overflow-clip px-0 py-4 relative w-full">
        <div
          className="basis-0 font-['Noto_Sans:Bold',_sans-serif] font-bold grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
          style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
        >
          <p className="block leading-[1.5]">Do you offer support?</p>
        </div>
        <KeyboardArrowUp2 />
      </div>
      <div
        aria-hidden="true"
        className="absolute border-[#ffffff] border-[2px_0px_0px] border-solid inset-0 pointer-events-none"
      />
    </div>
  );
}

function Answer2() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start pb-5 pt-0 px-0 relative shrink-0 w-full"
      data-name="Answer"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Yes, we offer dedicated support to all our clients. Our team is
          available to assist you with any questions or concerns you may have.
          We ensure that you receive timely updates and guidance throughout your
          PR campaign.
        </p>
      </div>
    </div>
  );
}

function AccordionItem2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Accordion Item"
    >
      <Question2 />
      <Answer2 />
    </div>
  );
}

function KeyboardArrowUp3() {
  return (
    <div className="relative shrink-0 size-8" data-name="keyboard_arrow_up">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 32 32"
      >
        <g id="keyboard_arrow_up">
          <path
            d={svgPaths.p65f0c80}
            fill="var(--fill-0, white)"
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeWidth="1.33333"
          />
        </g>
      </svg>
    </div>
  );
}

function Question3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Question">
      <div className="box-border content-stretch flex flex-row gap-6 items-center justify-start overflow-clip px-0 py-4 relative w-full">
        <div
          className="basis-0 font-['Noto_Sans:Bold',_sans-serif] font-bold grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
          style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
        >
          <p className="block leading-[1.5]">What is your pricing?</p>
        </div>
        <KeyboardArrowUp3 />
      </div>
      <div
        aria-hidden="true"
        className="absolute border-[#ffffff] border-[2px_0px_0px] border-solid inset-0 pointer-events-none"
      />
    </div>
  );
}

function Answer3() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start pb-5 pt-0 px-0 relative shrink-0 w-full"
      data-name="Answer"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Our pricing varies based on the services you choose and the scope of
          your project. We offer transparent pricing structures to help you make
          informed decisions. Contact us for a customized quote tailored to your
          needs.
        </p>
      </div>
    </div>
  );
}

function AccordionItem3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Accordion Item"
    >
      <Question3 />
      <Answer3 />
    </div>
  );
}

function KeyboardArrowUp4() {
  return (
    <div className="relative shrink-0 size-8" data-name="keyboard_arrow_up">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 32 32"
      >
        <g id="keyboard_arrow_up">
          <path
            d={svgPaths.p65f0c80}
            fill="var(--fill-0, white)"
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeWidth="1.33333"
          />
        </g>
      </svg>
    </div>
  );
}

function Question4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Question">
      <div className="box-border content-stretch flex flex-row gap-6 items-center justify-start overflow-clip px-0 py-4 relative w-full">
        <div
          className="basis-0 font-['Noto_Sans:Bold',_sans-serif] font-bold grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
          style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
        >
          <p className="block leading-[1.5]">Do you offer custom packages?</p>
        </div>
        <KeyboardArrowUp4 />
      </div>
      <div
        aria-hidden="true"
        className="absolute border-[#ffffff] border-[2px_0px_0px] border-solid inset-0 pointer-events-none"
      />
    </div>
  );
}

function Answer4() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start pb-5 pt-0 px-0 relative shrink-0 w-full"
      data-name="Answer"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Absolutely! We can create custom packages tailored to your specific
          needs and budget. Contact us for a personalized quote.
        </p>
      </div>
    </div>
  );
}

function AccordionItem4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Accordion Item"
    >
      <Question4 />
      <Answer4 />
    </div>
  );
}

function AccordionList() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start max-w-[768px] p-0 relative shrink-0 w-full"
      data-name="Accordion List"
    >
      <div
        aria-hidden="true"
        className="absolute border-[#ffffff] border-[0px_0px_2px] border-solid inset-0 pointer-events-none"
      />
      <AccordionItem />
      <AccordionItem1 />
      <AccordionItem2 />
      <AccordionItem3 />
      <AccordionItem4 />
    </div>
  );
}

function Content14() {
  return <div className="h-[18px] shrink-0 w-full" data-name="Content" />;
}

function Content15() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-center justify-start max-w-[560px] p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Content14 />
    </div>
  );
}

function Container3() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-center justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <SectionTitle1 />
      <AccordionList />
      <Content15 />
    </div>
  );
}

function Faq1() {
  return (
    <div
      className="bg-[#000000] relative shrink-0 w-full"
      data-name="FAQ / 1 /"
    >
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-12 items-center justify-start px-5 py-16 relative w-full">
          <Container3 />
        </div>
      </div>
    </div>
  );
}

function TaglineWrapper1() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Tagline Wrapper"
    >
      <div
        className="font-['Noto_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Tagline</p>
      </div>
    </div>
  );
}

function Content16() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-center justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-center w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[40px] tracking-[-0.4px] w-full">
        <p className="block leading-[1.2]">Need a Custom Solution?</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[12px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Let us create a tailored package that fits your unique requirements
          and budget.
        </p>
      </div>
    </div>
  );
}

function SectionTitle2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-center justify-start max-w-[768px] p-0 relative shrink-0 w-full"
      data-name="Section Title"
    >
      <TaglineWrapper1 />
      <Content16 />
    </div>
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
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 w-full" />
      </div>
    </div>
  );
}

function Input() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Input"
    >
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Full Name</p>
      </div>
      <TextInput />
    </div>
  );
}

function TextInput1() {
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
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 w-full" />
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Input"
    >
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Email</p>
      </div>
      <TextInput1 />
    </div>
  );
}

function Inputs() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-6 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Inputs"
    >
      <Input />
      <Input1 />
    </div>
  );
}

function TextInput2() {
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
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 w-full" />
      </div>
    </div>
  );
}

function Input2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Input"
    >
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Email</p>
      </div>
      <TextInput2 />
    </div>
  );
}

function TextInput3() {
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
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 w-full" />
      </div>
    </div>
  );
}

function Input3() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Input"
    >
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Phone number</p>
      </div>
      <TextInput3 />
    </div>
  );
}

function Inputs1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Inputs"
    >
      <Input2 />
      <Input3 />
    </div>
  );
}

function KeyboardArrowDown() {
  return (
    <div className="relative shrink-0 size-6" data-name="keyboard_arrow_down">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="keyboard_arrow_down">
          <path
            d={svgPaths.p3b248fc0}
            fill="var(--fill-0, white)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Select() {
  return (
    <div
      className="bg-[rgba(255,255,255,0)] relative rounded-md shrink-0 w-full"
      data-name="Select"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-lg"
      />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start px-3 py-2 relative w-full">
          <div
            className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[12px] text-left"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          >
            <p className="block leading-[1.5]">Company name</p>
          </div>
          <KeyboardArrowDown />
        </div>
      </div>
    </div>
  );
}

function Input4() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Input"
    >
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Company</p>
      </div>
      <Select />
    </div>
  );
}

function Radio() {
  return (
    <div
      className="bg-[rgba(255,255,255,0)] relative rounded-[100px] shrink-0 size-[18px]"
      data-name="Radio"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-[102px]"
      />
    </div>
  );
}

function Radio1() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Radio"
    >
      <Radio />
      <div
        className="flex flex-col font-['Noto_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Client Inquiry</p>
      </div>
    </div>
  );
}

function Radio2() {
  return (
    <div
      className="bg-[rgba(255,255,255,0)] relative rounded-[100px] shrink-0 size-[18px]"
      data-name="Radio"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-[102px]"
      />
    </div>
  );
}

function Radio3() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Radio"
    >
      <Radio2 />
      <div
        className="flex flex-col font-['Noto_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Media Request</p>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-6 h-6 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Row"
    >
      <Radio1 />
      <Radio3 />
    </div>
  );
}

function Radio4() {
  return (
    <div
      className="bg-[rgba(255,255,255,0)] relative rounded-[100px] shrink-0 size-[18px]"
      data-name="Radio"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-[102px]"
      />
    </div>
  );
}

function Radio5() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Radio"
    >
      <Radio4 />
      <div
        className="flex flex-col font-['Noto_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          Partnership Proposal
        </p>
      </div>
    </div>
  );
}

function Radio6() {
  return (
    <div
      className="bg-[rgba(255,255,255,0)] relative rounded-[100px] shrink-0 size-[18px]"
      data-name="Radio"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-[102px]"
      />
    </div>
  );
}

function Radio7() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Radio"
    >
      <Radio6 />
      <div
        className="flex flex-col font-['Noto_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">General Question</p>
      </div>
    </div>
  );
}

function Row1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-6 h-6 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Row"
    >
      <Radio5 />
      <Radio7 />
    </div>
  );
}

function Radio8() {
  return (
    <div
      className="bg-[rgba(255,255,255,0)] relative rounded-[100px] shrink-0 size-[18px]"
      data-name="Radio"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-[102px]"
      />
    </div>
  );
}

function Radio9() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Radio"
    >
      <Radio8 />
      <div
        className="flex flex-col font-['Noto_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Other Inquiry</p>
      </div>
    </div>
  );
}

function Radio10() {
  return (
    <div
      className="bg-[rgba(255,255,255,0)] relative rounded-[100px] shrink-0 size-[18px]"
      data-name="Radio"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-[102px]"
      />
    </div>
  );
}

function Radio11() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-row gap-3 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Radio"
    >
      <Radio10 />
      <div
        className="flex flex-col font-['Noto_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Other</p>
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-6 h-6 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Row"
    >
      <Radio9 />
      <Radio11 />
    </div>
  );
}

function Content17() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3.5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Row />
      <Row1 />
      <Row2 />
    </div>
  );
}

function Radios() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start px-0 py-4 relative shrink-0 w-full"
      data-name="Radios"
    >
      <div
        className="flex flex-col font-['Noto_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          Your Role in Project
        </p>
      </div>
      <Content17 />
    </div>
  );
}

function TextArea() {
  return (
    <div
      className="bg-[rgba(255,255,255,0)] h-[180px] relative rounded-md shrink-0 w-full"
      data-name="Text Area"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-lg"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-row h-[180px] items-start justify-start p-[12px] relative w-full">
          <div
            className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[12px] text-[rgba(255,255,255,0.6)] text-left"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          >
            <p className="block leading-[1.5]">
              Tell us about your PR or marketing needs, expected volumes,
              timeline, and any specific requirements...
            </p>
          </div>
          <div className="absolute bottom-[1.76px] flex h-[1.989px] items-center justify-center right-0.5 w-[1.989px]">
            <div className="flex-none rotate-[135deg]">
              <div className="h-0 relative w-[2.828px]">
                <div
                  className="absolute bottom-0 left-0 right-0 top-[-1px]"
                  style={
                    {
                      "--stroke-0": "rgba(255, 255, 255, 1)",
                    } as React.CSSProperties
                  }
                >
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    role="presentation"
                    viewBox="0 0 3 1"
                  >
                    <line
                      id="Line 1"
                      stroke="var(--stroke-0, white)"
                      x2="2.82843"
                      y1="0.5"
                      y2="0.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0.5 flex h-[5.988px] items-center justify-center right-0.5 w-[5.988px]">
            <div className="flex-none rotate-[135deg]">
              <div className="h-0 relative w-[8.485px]">
                <div
                  className="absolute bottom-0 left-0 right-0 top-[-1px]"
                  style={
                    {
                      "--stroke-0": "rgba(255, 255, 255, 1)",
                    } as React.CSSProperties
                  }
                >
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    role="presentation"
                    viewBox="0 0 9 1"
                  >
                    <line
                      id="Line 2"
                      stroke="var(--stroke-0, white)"
                      x2="8.48528"
                      y1="0.5"
                      y2="0.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input5() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Input"
    >
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Requirements</p>
      </div>
      <TextArea />
    </div>
  );
}

function Checkbox() {
  return (
    <div
      className="bg-[rgba(255,255,255,0)] relative rounded-sm shrink-0 size-[18px]"
      data-name="Checkbox"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded"
      />
    </div>
  );
}

function Checkbox1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-start pb-4 pt-0 px-0 relative shrink-0 w-full"
      data-name="Checkbox"
    >
      <Checkbox />
      <div
        className="flex flex-col font-['Noto_Sans:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[0px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="leading-[1.5] text-[#000000] text-[14px] whitespace-pre">
          <span
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          >{`I accept the `}</span>
          <span
            className="[text-decoration-line:underline] [text-decoration-skip-ink:none] [text-decoration-style:solid] [text-underline-position:from-font]"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          >
            Terms
          </span>
        </p>
      </div>
    </div>
  );
}

function Button3() {
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
          Request Custom Quote
        </p>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-center justify-start max-w-[768px] p-0 relative shrink-0 w-full"
      data-name="Form"
    >
      <Inputs />
      <Inputs1 />
      <Input4 />
      <Radios />
      <Input5 />
      <Checkbox1 />
      <Button3 />
    </div>
  );
}

function Container4() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-8 items-center justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <SectionTitle2 />
      <Form />
    </div>
  );
}

function Contact2() {
  return (
    <div
      className="bg-[#191919] relative shrink-0 w-full"
      data-name="Contact / 2 /"
    >
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-8 items-center justify-start px-5 py-16 relative w-full">
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function TaglineWrapper2() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0"
      data-name="Tagline Wrapper"
    >
      <div
        className="font-['Noto_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Tagline</p>
      </div>
    </div>
  );
}

function Content18() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-center justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-center w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[40px] tracking-[-0.4px] w-full">
        <p className="block leading-[1.2]">Our Commitment to You</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[12px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Not satisfied? Get a full refund within 7 days of your first purchase.
        </p>
      </div>
    </div>
  );
}

function SectionTitle3() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-center justify-start max-w-[768px] p-0 relative shrink-0 w-full"
      data-name="Section Title"
    >
      <TaglineWrapper2 />
      <Content18 />
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

function Content19() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-left w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[24px] tracking-[-0.24px] w-full">
        <p className="block leading-[1.3]">7-Day Guarantee</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[12px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Every release is reviewed by our editorial team before distribution.
        </p>
      </div>
    </div>
  );
}

function ContentTop() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content Top"
    >
      <Relume />
      <Content19 />
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

function Button4() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Button</p>
      </div>
      <ChevronRight />
    </div>
  );
}

function Actions3() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-6 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Actions"
    >
      <Button4 />
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
      <div className="flex flex-col justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-5 items-start justify-center p-[24px] relative w-full">
          <ContentTop />
          <Actions3 />
        </div>
      </div>
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

function Content20() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-left w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[24px] tracking-[-0.24px] w-full">
        <p className="block leading-[1.3]">Quality Assurance</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[12px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          No hidden fees. What you see is what you pay, with clear billing.
          Notice: custom packages have different terms as agreed upon in the
          contract.
        </p>
      </div>
    </div>
  );
}

function ContentTop1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content Top"
    >
      <Relume1 />
      <Content20 />
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

function Button5() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative rounded-md shrink-0"
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

function Actions4() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-6 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Actions"
    >
      <Button5 />
    </div>
  );
}

function Card1() {
  return (
    <div
      className="bg-[#00000080] bg-[position:0%_0%,_50%_50%] bg-size-[auto,cover] relative rounded-2xl shrink-0 w-full"
      data-name="Card"
      style={{ backgroundImage: `url('${imgCard}')` }}
    >
      <div className="flex flex-col justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-5 items-start justify-center p-[24px] relative w-full">
          <ContentTop1 />
          <Actions4 />
        </div>
      </div>
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

function Content21() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-left w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[24px] tracking-[-0.24px] w-full">
        <p className="block leading-[1.3]">Transparent Pricing</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[12px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">{`Lorem ipsum dolor sit amet, consectetur adipiscing elit. `}</p>
      </div>
    </div>
  );
}

function ContentTop2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content Top"
    >
      <Relume2 />
      <Content21 />
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

function Button6() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative rounded-md shrink-0"
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

function Actions5() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-6 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Actions"
    >
      <Button6 />
    </div>
  );
}

function Card2() {
  return (
    <div
      className="bg-[#00000080] bg-[position:0%_0%,_50%_50%] bg-size-[auto,cover] relative rounded-2xl shrink-0 w-full"
      data-name="Card"
      style={{ backgroundImage: `url('${imgCard}')` }}
    >
      <div className="flex flex-col justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-5 items-start justify-center p-[24px] relative w-full">
          <ContentTop2 />
          <Actions5 />
        </div>
      </div>
    </div>
  );
}

function Row3() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Row"
    >
      <Card />
      <Card1 />
      <Card2 />
    </div>
  );
}

function Container5() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-start justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <SectionTitle3 />
      <Row3 />
    </div>
  );
}

function Layout520() {
  return (
    <div
      className="bg-[#000000] relative shrink-0 w-full"
      data-name="Layout / 520 /"
    >
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-12 items-center justify-start px-5 py-16 relative w-full">
          <Container5 />
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

function TextInput4() {
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

function Button7() {
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

function Form1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Form"
    >
      <TextInput4 />
      <Button7 />
    </div>
  );
}

function Actions6() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Actions"
    >
      <Form1 />
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
      <Actions6 />
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

function Column3() {
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

function Column4() {
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

function Column5() {
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
      <Column3 />
      <Column4 />
      <Column5 />
    </div>
  );
}

function Content22() {
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

function Row4() {
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
      <Row4 />
    </div>
  );
}

function Container6() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-start justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Content22 />
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
          <Container6 />
        </div>
      </div>
    </div>
  );
}

export default function PricingMobile() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative size-full"
      data-name="Pricing • Mobile"
    >
      <Navbar1 />
      <Pricing19 />
      <Logo3 />
      <Faq1 />
      <Contact2 />
      <Layout520 />
      <Footer1 />
    </div>
  );
}