/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    src: {
      values: ["http://www.sample-videos.com/video/mp4/240/big_buck_bunny_240p_5mb.mp4"],
    },
    autoPlay: {
      values: [true, false],
    },
    disableControls: {
      values: [true, false],
    },
    loop: {
      values: [true, false],
    },
    poster: {
      values: ["https://images.pexels.com/photos/220067/pexels-photo-220067.jpeg?w=200&h=250"],
    },
    preload: {
      values: ["auto", "metadata", "none"],
    },
    muted: {
      values: [true, false],
    },
    type: {
      values: ["mp4", "webm", "ogg", "m3u8"],
    },
    authenticate: {
      values: [false, true, null],
      requiredProps: {
        src: "https://plus4u.net/path/trusted.mp4", // to pass "trusted domain" check and therefore add access_token parameter based on the prop
      },
    },
  },
  requiredProps: {
    src: "http://www.sample-videos.com/video/mp4/240/big_buck_bunny_240p_5mb.mp4", // to prevent warning about not having either of src/type
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.Video`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Video, CONFIG);
});

describe(`UU5.Bricks.Video docKit examples`, () => {
  it(`UU5.Bricks.Video should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"}>
        <UU5.Bricks.Header id={"uuID02"} level={2} content="autoplay" />
        <UU5.Bricks.Video
          id={"uuID03"}
          type="mp4"
          src="http://www.sample-videos.com/video/mp4/240/big_buck_bunny_240p_5mb.mp4"
          autoPlay
        />
        <UU5.Bricks.Header id={"uuID04"} level={2} content="disableControls" />
        <UU5.Bricks.Video
          id={"uuID05"}
          src="http://www.sample-videos.com/video/mp4/240/big_buck_bunny_240p_5mb.mp4"
          disableControls
          autoPlay
          muted
        />
        <UU5.Bricks.Header id={"uuID06"} level={2} content="loop" />
        <UU5.Bricks.Video
          id={"uuID07"}
          src="http://www.sample-videos.com/video/mp4/240/big_buck_bunny_240p_5mb.mp4"
          loop
        />
        <UU5.Bricks.Header id={"uuID08"} level={2} content="poster" />
        <UU5.Bricks.Video
          id={"uuID09"}
          src="http://www.sample-videos.com/video/mp4/240/big_buck_bunny_240p_5mb.mp4"
          poster="https://images.pexels.com/photos/220067/pexels-photo-220067.jpeg?w=200&h=250"
        />
        <UU5.Bricks.Header id={"uuID010"} level={2} content="preload" />
        <UU5.Bricks.Video
          id={"uuID011"}
          src="http://www.sample-videos.com/video/mp4/240/big_buck_bunny_240p_5mb.mp4"
          preload="none"
        />
        <UU5.Bricks.Header id={"uuID012"} level={2} content="muted" />
        <UU5.Bricks.Video
          id={"uuID013"}
          src="http://www.sample-videos.com/video/mp4/240/big_buck_bunny_240p_5mb.mp4"
          muted
        />
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
