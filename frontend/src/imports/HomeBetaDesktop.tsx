import svgPaths from "./svg-f7gq800qcd";
import imgCompanyLogo from "figma:asset/02c3e5f2002e51a1d0215f19a569aa7fce8ebe6a.png";

const imgHeader5 = 'https://img.vortixpr.com/VortixPR_Website/look_left_bg_cat%20(1).png';
import imgStats10 from "figma:asset/c5c61078af5a4706e5515dbeabfaecc55c76e542.png";
import imgPlaceholderImage from "figma:asset/c79d7f21c404cf28a35c0be8bcf6afb7466c18e7.png";
import imgAvatarImage from "figma:asset/a6d49a00f1ac44890e249a1b716981502b19f3d4.png";
import imgPlaceholderImage1 from "figma:asset/b7052d9717896b616452306e15a912bfa180d66c.png";

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
      className="box-border content-stretch flex flex-row h-10 items-center justify-center p-0 relative shrink-0 w-20"
      data-name="Content"
    >
      <CompanyLogo />
    </div>
  );
}

function Link() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-0 relative shrink-0"
      data-name="Link"
    >
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Home</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-0 relative shrink-0"
      data-name="Link"
    >
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Services</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-0 relative shrink-0"
      data-name="Link"
    >
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Pricing</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-0 relative shrink-0"
      data-name="Link"
    >
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Our Client</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-0 relative shrink-0"
      data-name="Link"
    >
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Publisher</p>
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-6" data-name="Chevron Down">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="Chevron Down">
          <path
            clipRule="evenodd"
            d={svgPaths.pee47f00}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function NavLinkDropdown() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Nav Link Dropdown"
    >
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Resources</p>
      </div>
      <ChevronDown />
    </div>
  );
}

function Link5() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-center p-0 relative shrink-0"
      data-name="Link"
    >
      <NavLinkDropdown />
    </div>
  );
}

function NavLinks() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-8 items-center justify-end p-0 relative shrink-0"
      data-name="Nav links"
    >
      <Link />
      <Link1 />
      <Link2 />
      <Link3 />
      <Link4 />
      <Link5 />
    </div>
  );
}

function Button() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-5 py-2 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-lg"
      />
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Login</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-5 py-2 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#ff7400] border-solid inset-[-1px] pointer-events-none rounded-[7px]"
      />
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Sign Up</p>
      </div>
    </div>
  );
}

function Actions() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-center justify-center p-0 relative shrink-0"
      data-name="Actions"
    >
      <Button />
      <Button1 />
    </div>
  );
}

function Column() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-8 items-center justify-center p-0 relative shrink-0"
      data-name="Column"
    >
      <NavLinks />
      <Actions />
    </div>
  );
}

function Container() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Content />
      <Column />
    </div>
  );
}

function Navbar1() {
  return (
    <div
      className="bg-[#000000] h-[72px] relative shrink-0 w-full"
      data-name="Navbar / 1 /"
    >
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col h-[72px] items-center justify-center px-16 py-0 relative w-full">
          <Container />
        </div>
      </div>
    </div>
  );
}

function Content1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-start justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-left w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium leading-[1.2] relative shrink-0 text-[72px] tracking-[-0.72px] w-full">
        <p className="block mb-0">Shaping Influence:</p>
        <p className="block">Disruptive PR Strategies for Crypto and AI</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[18px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Get your crypto and AI news in front of the right people—fast,
          reliably, and on the industry’s most influential platforms.
        </p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div
      className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2 items-center justify-center px-6 py-2.5 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#ffffff] border-solid inset-[-1px] pointer-events-none rounded-[7px]"
      />
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Submit Now</p>
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
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-lg"
      />
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Get Your Quote</p>
      </div>
    </div>
  );
}

function Actions1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0"
      data-name="Actions"
    >
      <Button2 />
      <Button3 />
    </div>
  );
}

function Column1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-8 items-start justify-start max-w-[560px] p-0 relative shrink-0 w-full"
      data-name="Column"
    >
      <Content1 />
      <Actions1 />
    </div>
  );
}

function Container1() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-20 grow items-start justify-start max-w-[1280px] min-h-px min-w-px p-0 relative shrink-0"
      data-name="Container"
    >
      <Column1 />
    </div>
  );
}

function Header5() {
  return (
    <div
      className="bg-[#00000080] bg-[position:0%_0%,_50%_50%] bg-size-[auto,cover] h-[900px] relative shrink-0 w-full"
      data-name="Header / 5 /"
      style={{ backgroundImage: `url('${imgHeader5}')` }}
    >
      <div className="flex flex-row items-center justify-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row h-[900px] items-center justify-center px-16 py-0 relative w-full">
          <Container1 />
        </div>
      </div>
    </div>
  );
}

function Stat() {
  return (
    <div
      className="basis-0 grow min-h-px min-w-px relative shrink-0"
      data-name="Stat"
    >
      <div
        aria-hidden="true"
        className="absolute border-[#ffffff] border-[0px_0px_0px_2px] border-solid inset-0 pointer-events-none"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start leading-[0] pl-8 pr-0 py-0 relative text-[#ffffff] text-left w-full">
          <div
            className="font-['Roboto:Bold',_sans-serif] font-bold relative shrink-0 text-[80px] w-full"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            <p className="block leading-[1.3]">200+</p>
          </div>
          <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[22px] tracking-[-0.22px] w-full">
            <p className="block leading-[1.4]">Press Releases Sent / Year</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat1() {
  return (
    <div
      className="basis-0 grow min-h-px min-w-px relative shrink-0"
      data-name="Stat"
    >
      <div
        aria-hidden="true"
        className="absolute border-[#ffffff] border-[0px_0px_0px_2px] border-solid inset-0 pointer-events-none"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start leading-[0] pl-8 pr-0 py-0 relative text-[#ffffff] text-left w-full">
          <div
            className="font-['Roboto:Bold',_sans-serif] font-bold relative shrink-0 text-[80px] w-full"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            <p className="block leading-[1.3]">300+</p>
          </div>
          <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[22px] tracking-[-0.22px] w-full">
            <p className="block leading-[1.4]">Media Partners</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat2() {
  return (
    <div
      className="basis-0 grow min-h-px min-w-px relative shrink-0"
      data-name="Stat"
    >
      <div
        aria-hidden="true"
        className="absolute border-[#ffffff] border-[0px_0px_0px_2px] border-solid inset-0 pointer-events-none"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start leading-[0] pl-8 pr-0 py-0 relative text-[#ffffff] text-left w-full">
          <div
            className="font-['Roboto:Bold',_sans-serif] font-bold relative shrink-0 text-[80px] w-full"
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            <p className="block leading-[1.3]">800+</p>
          </div>
          <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[22px] tracking-[-0.22px] w-full">
            <p className="block leading-[1.4]">Campaigns Launched</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-12 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Row"
    >
      <Stat />
      <Stat1 />
      <Stat2 />
    </div>
  );
}

function Content2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-16 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Row />
    </div>
  );
}

function Container2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-20 items-start justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium leading-[0] max-w-[768px] relative shrink-0 text-[#ffffff] text-[44px] text-left tracking-[-0.44px] w-full">
        <p className="block leading-[1.2]">Impact at a Glance</p>
      </div>
      <Content2 />
    </div>
  );
}

function Stats10() {
  return (
    <div
      className="aspect-[1440/500] bg-[#00000080] bg-[position:0%_0%,_50%_50%] bg-size-[auto,cover] relative shrink-0 w-full"
      data-name="Stats / 10 /"
      style={{ backgroundImage: `url('${imgStats10}')` }}
    >
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="aspect-[1440/500] box-border content-stretch flex flex-col gap-20 items-center justify-start px-16 py-28 relative size-full">
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-16 py-0 relative w-full">
          <div
            className="font-['Noto_Sans:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#ffffff] text-[18px] text-center w-[560px]"
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

function Content3() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-6 items-center justify-center p-0 relative shrink-0"
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

function Content4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Content3 />
    </div>
  );
}

function Logo3() {
  return (
    <div
      className="bg-[#000000] box-border content-stretch flex flex-col gap-12 items-center justify-start overflow-clip px-0 py-20 relative shrink-0 w-full"
      data-name="Logo / 3 /"
    >
      <Container3 />
      <Content4 />
    </div>
  );
}

function PlaceholderLogo7() {
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

function Logo() {
  return (
    <div
      className="bg-[#191919] box-border content-stretch flex flex-col gap-3.5 items-center justify-center p-[14px] relative rounded-2xl shrink-0 w-[420px]"
      data-name="Logo"
    >
      <PlaceholderLogo7 />
    </div>
  );
}

function PlaceholderLogo8() {
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

function Logo1() {
  return (
    <div
      className="bg-[#191919] box-border content-stretch flex flex-col gap-3.5 items-center justify-center p-[14px] relative rounded-2xl shrink-0 w-[420px]"
      data-name="Logo"
    >
      <PlaceholderLogo8 />
    </div>
  );
}

function Row1() {
  return (
    <div
      className="[flex-flow:wrap] box-border content-start flex gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Row"
    >
      <Logo />
      <Logo1 />
      <Logo />
    </div>
  );
}

function PlaceholderLogo10() {
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

function Logo4() {
  return (
    <div
      className="bg-[#191919] box-border content-stretch flex flex-col gap-3.5 items-center justify-center p-[14px] relative rounded-2xl shrink-0 w-[420px]"
      data-name="Logo"
    >
      <PlaceholderLogo10 />
    </div>
  );
}

function PlaceholderLogo11() {
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

function Logo5() {
  return (
    <div
      className="bg-[#191919] box-border content-stretch flex flex-col gap-3.5 items-center justify-center p-[14px] relative rounded-2xl shrink-0 w-[420px]"
      data-name="Logo"
    >
      <PlaceholderLogo11 />
    </div>
  );
}

function Row2() {
  return (
    <div
      className="[flex-flow:wrap] box-border content-start flex gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Row"
    >
      <Logo4 />
      <Logo5 />
      <Logo4 />
    </div>
  );
}

function Container4() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-12 items-center justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Row1 />
      <Row2 />
      <Row1 />
    </div>
  );
}

function Logo6() {
  return (
    <div
      className="bg-[#191919] relative shrink-0 w-full"
      data-name="Logo / 6 /"
    >
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-12 items-center justify-start px-16 py-20 relative w-full">
          <Container4 />
        </div>
      </div>
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
        className="font-['Noto_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Maximize</p>
      </div>
    </div>
  );
}

function Content5() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-start justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-left w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[52px] tracking-[-0.52px] w-full">
        <p className="block leading-[1.2]">
          Elevate Your Crypto News Coverage Today
        </p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[18px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Unlock the potential of your crypto and AI projects with our extensive
          media network. We ensure your news reaches the right audiences,
          amplifying your impact in the blockchain space.
        </p>
      </div>
    </div>
  );
}

function SectionTitle() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Section Title"
    >
      <TaglineWrapper />
      <Content5 />
    </div>
  );
}

function Relume() {
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

function ListItem() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Relume />
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[16px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Reach top-tier outlets for maximum visibility.
        </p>
      </div>
    </div>
  );
}

function Relume1() {
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

function ListItem1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Relume1 />
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[16px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Engage with key influencers in the crypto industry.
        </p>
      </div>
    </div>
  );
}

function Relume2() {
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

function ListItem2() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="List Item"
    >
      <Relume2 />
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[16px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Drive impactful narratives that resonate with your audience.
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
    </div>
  );
}

function Content6() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-8 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <SectionTitle />
      <List />
    </div>
  );
}

function Button4() {
  return (
    <div className="relative rounded-md shrink-0" data-name="Button">
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip px-6 py-2.5 relative">
        <div
          className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
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

function Button5() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip p-0 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Button</p>
      </div>
      <ChevronRight />
    </div>
  );
}

function Actions2() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-6 items-center justify-start p-0 relative shrink-0"
      data-name="Actions"
    >
      <Button4 />
      <Button5 />
    </div>
  );
}

function Content7() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-8 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Content"
    >
      <Content6 />
      <Actions2 />
    </div>
  );
}

function Component() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-20 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Component"
    >
      <Content7 />
      <div
        className="aspect-[600/640] basis-0 bg-center bg-cover bg-no-repeat grow min-h-px min-w-px rounded-2xl shrink-0"
        data-name="Placeholder Image"
        style={{ backgroundImage: `url('${imgPlaceholderImage}')` }}
      />
    </div>
  );
}

function Container5() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-20 items-start justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Component />
    </div>
  );
}

function Layout16() {
  return (
    <div
      className="bg-[#000000] relative shrink-0 w-full"
      data-name="Layout / 16 /"
    >
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-20 items-center justify-start px-16 py-28 relative w-full">
          <Container5 />
        </div>
      </div>
    </div>
  );
}

function Stars() {
  return (
    <div className="h-[18.889px] relative shrink-0 w-[116px]" data-name="Stars">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 116 19"
      >
        <g clipPath="url(#clip0_1_792)" id="Stars">
          <path
            d={svgPaths.p23629f00}
            fill="var(--fill-0, white)"
            id="Vector"
          />
          <path
            d={svgPaths.p84d7480}
            fill="var(--fill-0, white)"
            id="Vector_2"
          />
          <path
            d={svgPaths.p24418170}
            fill="var(--fill-0, white)"
            id="Vector_3"
          />
          <path
            d={svgPaths.p28ff5800}
            fill="var(--fill-0, white)"
            id="Vector_4"
          />
          <path
            d={svgPaths.p32177b30}
            fill="var(--fill-0, white)"
            id="Vector_5"
          />
        </g>
        <defs>
          <clipPath id="clip0_1_792">
            <rect fill="white" height="18.8889" width="116" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function AvatarContent() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
      data-name="Avatar Content"
    >
      <div
        className="font-['Noto_Sans:SemiBold',_sans-serif] font-semibold relative shrink-0"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] text-nowrap whitespace-pre">
          Alex Johnson
        </p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] text-nowrap whitespace-pre">
          CEO, Tech Innovations
        </p>
      </div>
    </div>
  );
}

function PlaceholderLogo16() {
  return (
    <div
      className="h-[48px] relative shrink-0 w-[120.001px]"
      data-name="Placeholder Logo"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 120 48"
      >
        <g id="Placeholder Logo">
          <g id="Logo">
            <path
              clipRule="evenodd"
              d={svgPaths.p2d05e380}
              fill="var(--fill-0, white)"
              fillRule="evenodd"
            />
            <path d={svgPaths.p35259300} fill="var(--fill-0, white)" />
            <path
              clipRule="evenodd"
              d={svgPaths.p31773980}
              fill="var(--fill-0, white)"
              fillRule="evenodd"
            />
            <path d={svgPaths.p346ed980} fill="var(--fill-0, white)" />
            <path
              clipRule="evenodd"
              d={svgPaths.p1d80cb00}
              fill="var(--fill-0, white)"
              fillRule="evenodd"
            />
            <path d={svgPaths.p25618780} fill="var(--fill-0, white)" />
            <path
              clipRule="evenodd"
              d={svgPaths.p1f5f4400}
              fill="var(--fill-0, white)"
              fillRule="evenodd"
            />
            <path d={svgPaths.p189ee080} fill="var(--fill-0, white)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Avatar() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-5 items-center justify-start p-0 relative shrink-0"
      data-name="Avatar"
    >
      <div className="relative shrink-0 size-14" data-name="Avatar Image">
        <img
          className="block max-w-none size-full"
          height="56"
          loading="lazy"
          src={imgAvatarImage}
          width="56"
        />
      </div>
      <AvatarContent />
      <div className="flex h-[61px] items-center justify-center relative shrink-0 w-[0px]">
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[61px]" data-name="Divider">
            <div
              className="absolute bottom-0 left-0 right-0 top-[-2px]"
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
                viewBox="0 0 61 2"
              >
                <line
                  id="Divider"
                  stroke="var(--stroke-0, white)"
                  strokeWidth="2"
                  x2="61"
                  y1="1"
                  y2="1"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <PlaceholderLogo16 />
    </div>
  );
}

function Content8() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-8 items-center justify-start max-w-[768px] overflow-clip p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Stars />
      <div
        className="font-['Space_Grotesk:Medium',_sans-serif] font-medium leading-[0] min-w-full relative shrink-0 text-[#ffffff] text-[28px] text-center tracking-[-0.28px]"
        style={{ width: "min-content" }}
      >
        <p className="block leading-[1.4]">{`"VortixPR transformed our media presence, elevating our project visibility in ways we never thought possible."`}</p>
      </div>
      <Avatar />
    </div>
  );
}

function Container6() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-20 items-center justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Content8 />
    </div>
  );
}

function Testimonial4() {
  return (
    <div
      className="bg-[#191919] relative shrink-0 w-full"
      data-name="Testimonial / 4 /"
    >
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col gap-20 items-center justify-start px-16 py-28 relative w-full">
          <Container6 />
        </div>
      </div>
    </div>
  );
}

function SectionTitle1() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-center justify-start leading-[0] max-w-[768px] p-0 relative shrink-0 text-[#ffffff] text-center w-full"
      data-name="Section Title"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[52px] tracking-[-0.52px] w-full">
        <p className="block leading-[1.2]">FAQs</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[18px] w-full"
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
            d={svgPaths.p1a7aba00}
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
      <div className="box-border content-stretch flex flex-row gap-6 items-center justify-start overflow-clip px-0 py-5 relative w-full">
        <div
          className="basis-0 font-['Noto_Sans:Bold',_sans-serif] font-bold grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[18px] text-left"
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
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start pb-6 pt-0 px-0 relative shrink-0 w-full"
      data-name="Answer"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[16px] text-left"
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
            d={svgPaths.p1a7aba00}
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
      <div className="box-border content-stretch flex flex-row gap-6 items-center justify-start overflow-clip px-0 py-5 relative w-full">
        <div
          className="basis-0 font-['Noto_Sans:Bold',_sans-serif] font-bold grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[18px] text-left"
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
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start pb-6 pt-0 px-0 relative shrink-0 w-full"
      data-name="Answer"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[16px] text-left"
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
            d={svgPaths.p1a7aba00}
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
      <div className="box-border content-stretch flex flex-row gap-6 items-center justify-start overflow-clip px-0 py-5 relative w-full">
        <div
          className="basis-0 font-['Noto_Sans:Bold',_sans-serif] font-bold grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[18px] text-left"
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
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start pb-6 pt-0 px-0 relative shrink-0 w-full"
      data-name="Answer"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[16px] text-left"
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
            d={svgPaths.p1a7aba00}
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
      <div className="box-border content-stretch flex flex-row gap-6 items-center justify-start overflow-clip px-0 py-5 relative w-full">
        <div
          className="basis-0 font-['Noto_Sans:Bold',_sans-serif] font-bold grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[18px] text-left"
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
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start pb-6 pt-0 px-0 relative shrink-0 w-full"
      data-name="Answer"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[16px] text-left"
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
            d={svgPaths.p1a7aba00}
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
      <div className="box-border content-stretch flex flex-row gap-6 items-center justify-start overflow-clip px-0 py-5 relative w-full">
        <div
          className="basis-0 font-['Noto_Sans:Bold',_sans-serif] font-bold grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[18px] text-left"
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
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start pb-6 pt-0 px-0 relative shrink-0 w-full"
      data-name="Answer"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[16px] text-left"
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
      className="box-border content-stretch flex flex-col items-start justify-start max-w-[768px] p-0 relative shrink-0 w-full"
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

function Content9() {
  return <div className="h-[27px] shrink-0 w-full" data-name="Content" />;
}

function Content10() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-center justify-start max-w-[560px] p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Content9 />
    </div>
  );
}

function Container7() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-20 items-center justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <SectionTitle1 />
      <AccordionList />
      <Content10 />
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
        <div className="box-border content-stretch flex flex-col gap-20 items-center justify-start px-16 py-28 relative w-full">
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
      className="basis-0 bg-[rgba(255,255,255,0)] grow min-h-px min-w-px relative rounded-md shrink-0"
      data-name="Text input"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-lg"
      />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 relative w-full">
          <div
            className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[16px] text-[rgba(255,255,255,0.6)] text-left"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          >
            <p className="block leading-[1.5]">Enter your email</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button6() {
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
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Subscribe</p>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Form"
    >
      <TextInput />
      <Button6 />
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
        <p className="leading-[1.5] text-[12px]">
          <span>{`By subscribing you agree to with our `}</span>
          <span
            className="[text-decoration-line:underline] [text-decoration-skip-ink:none] [text-decoration-style:solid] [text-underline-position:from-font] font-['Noto_Sans:Regular',_sans-serif] font-normal"
            style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
          >
            Privacy Policy
          </span>
          <span>{` and provide consent to receive updates from our company.`}</span>
        </p>
      </div>
    </div>
  );
}

function Newsletter() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-[500px]"
      data-name="Newsletter"
    >
      <CompanyLogo1 />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] min-w-full relative shrink-0 text-[#ffffff] text-[16px] text-left"
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

function Link6() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[14px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Homepage</p>
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
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[14px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Services</p>
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
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[14px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Pricing</p>
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
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[14px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Our Clients</p>
      </div>
    </div>
  );
}

function Link10() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[14px] text-left"
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
      <Link6 />
      <Link7 />
      <Link8 />
      <Link9 />
      <Link10 />
    </div>
  );
}

function Column2() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-4 grow items-start justify-start min-h-px min-w-px overflow-clip p-0 relative shrink-0"
      data-name="Column"
    >
      <div
        className="font-['Noto_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Map</p>
      </div>
      <FooterLinks />
    </div>
  );
}

function Link11() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[14px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Link Six</p>
      </div>
    </div>
  );
}

function Link12() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[14px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Link Seven</p>
      </div>
    </div>
  );
}

function Link13() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[14px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Link Eight</p>
      </div>
    </div>
  );
}

function Link14() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[14px] text-left"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">Link Nine</p>
      </div>
    </div>
  );
}

function Link15() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <div
        className="basis-0 font-['Noto_Sans:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#ffffff] text-[14px] text-left"
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
      <Link11 />
      <Link12 />
      <Link13 />
      <Link14 />
      <Link15 />
    </div>
  );
}

function Column3() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-4 grow items-start justify-start min-h-px min-w-px overflow-clip p-0 relative shrink-0"
      data-name="Column"
    >
      <div
        className="font-['Noto_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left w-full"
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

function Link16() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <Facebook />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap"
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

function Link17() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <Instagram />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap"
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

function Link18() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <X />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap"
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

function Link19() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <LinkedIn />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap"
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

function Link20() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Link"
    >
      <Youtube />
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap"
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
      <Link16 />
      <Link17 />
      <Link18 />
      <Link19 />
      <Link20 />
    </div>
  );
}

function Column4() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-4 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Column"
    >
      <div
        className="font-['Noto_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left w-full"
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
      className="basis-0 box-border content-stretch flex flex-row gap-10 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Links"
    >
      <Column2 />
      <Column3 />
      <Column4 />
    </div>
  );
}

function Content11() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-32 h-[248px] items-start justify-start p-0 relative shrink-0 w-full"
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
      className="box-border content-stretch flex flex-row font-['Noto_Sans:Regular',_sans-serif] font-normal gap-6 items-start justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap"
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
      className="box-border content-stretch flex flex-row items-start justify-between p-0 relative shrink-0 w-full"
      data-name="Row"
    >
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">
          © 2025 VertixStream. All rights reserved.
        </p>
      </div>
      <FooterLinks2 />
    </div>
  );
}

function Credits() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-8 items-start justify-start p-0 relative shrink-0 w-full"
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
            viewBox="0 0 1280 2"
          >
            <line
              id="Divider"
              stroke="var(--stroke-0, white)"
              strokeWidth="2"
              x2="1280"
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

function Container8() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-20 items-start justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Content11 />
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
        <div className="box-border content-stretch flex flex-col gap-20 items-center justify-start px-16 py-20 relative w-full">
          <Container8 />
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
        className="font-['Noto_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Services</p>
      </div>
    </div>
  );
}

function Content12() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-center justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-center w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[52px] tracking-[-0.52px] w-full">
        <p className="block leading-[1.2]">Our PR Solutions</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[18px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          At VortixPR, we amplify blockchain, Web3, and AI projects through
          strategic media engagement. Our global network ensures your message
          resonates with the right audience.
        </p>
      </div>
    </div>
  );
}

function SectionTitle2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-center justify-start max-w-[768px] p-0 relative shrink-0 w-full"
      data-name="Section Title"
    >
      <TaglineWrapper1 />
      <Content12 />
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

function Content13() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-center justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-center w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[28px] tracking-[-0.28px] w-full">
        <p className="block leading-[1.4]">Blockchain / Crypto PR</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[16px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Unique public relations strategies tailored for the Blockchain and
          Crypto sectors.
        </p>
      </div>
    </div>
  );
}

function Content14() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Relume3 />
      <Content13 />
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

function Content15() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-center justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-center w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[28px] tracking-[-0.28px] w-full">
        <p className="block leading-[1.4]">{`AI Product PR & Strategic Messaging`}</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[16px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Specialized PR for AI startups, agent platforms, and emerging
          applicaiton solutions.
        </p>
      </div>
    </div>
  );
}

function Content16() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Relume4 />
      <Content15 />
    </div>
  );
}

function Column5() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-16 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Column"
    >
      <Content14 />
      <Content16 />
    </div>
  );
}

function Relume5() {
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

function Content17() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-center justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-center w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[28px] tracking-[-0.28px] w-full">
        <p className="block leading-[1.4]">{`Global & Regional Media Distribution`}</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[16px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Comprehensive press release distribution across tier-1 media outlets
          worldwide.
        </p>
      </div>
    </div>
  );
}

function Content18() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Relume5 />
      <Content17 />
    </div>
  );
}

function Relume6() {
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
      className="box-border content-stretch flex flex-col gap-4 items-center justify-start leading-[0] p-0 relative shrink-0 text-[#ffffff] text-center w-full"
      data-name="Content"
    >
      <div className="font-['Space_Grotesk:Medium',_sans-serif] font-medium relative shrink-0 text-[28px] tracking-[-0.28px] w-full">
        <p className="block leading-[1.4]">{`Influencer Marketing & Community Activation`}</p>
      </div>
      <div
        className="font-['Noto_Sans:Regular',_sans-serif] font-normal relative shrink-0 text-[16px] w-full"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5]">
          Leverage key opinion leaders and build engaged communities around your
          project.
        </p>
      </div>
    </div>
  );
}

function Content20() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Relume6 />
      <Content19 />
    </div>
  );
}

function Column6() {
  return (
    <div
      className="basis-0 box-border content-stretch flex flex-col gap-16 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0"
      data-name="Column"
    >
      <Content18 />
      <Content20 />
    </div>
  );
}

function Content21() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-12 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Content"
    >
      <Column5 />
      <div
        className="bg-center bg-cover bg-no-repeat rounded-2xl shrink-0 size-[540px]"
        data-name="Placeholder Image"
        style={{ backgroundImage: `url('${imgPlaceholderImage1}')` }}
      />
      <Column6 />
    </div>
  );
}

function Button7() {
  return (
    <div className="relative rounded-md shrink-0" data-name="Button">
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip px-6 py-2.5 relative">
        <div
          className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
          style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
        >
          <p className="block leading-[1.5] whitespace-pre">Get Started</p>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-lg"
      />
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

function Button8() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip p-0 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        className="font-['Noto_Sans:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap"
        style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}
      >
        <p className="block leading-[1.5] whitespace-pre">Contact Us</p>
      </div>
      <ChevronRight1 />
    </div>
  );
}

function Actions4() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-6 items-center justify-start p-0 relative shrink-0"
      data-name="Actions"
    >
      <Button7 />
      <Button8 />
    </div>
  );
}

function Container9() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-20 items-center justify-start max-w-[1280px] p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <SectionTitle2 />
      <Content21 />
      <Actions4 />
    </div>
  );
}

function Layout254() {
  return (
    <div
      className="bg-[#000000] box-border content-stretch flex flex-col gap-20 items-center justify-start overflow-clip px-16 py-28 relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] shrink-0 w-[1440px]"
      data-name="Layout / 254 /"
    >
      <Container9 />
    </div>
  );
}

export default function HomeBetaDesktop() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative size-full"
      data-name="Home (beta) • Desktop"
    >
      <Navbar1 />
      <Header5 />
      <Stats10 />
      <Logo3 />
      <Logo6 />
      <Layout16 />
      <Testimonial4 />
      <Faq1 />
      <Footer1 />
      <Layout254 />
    </div>
  );
}