import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import ko from "date-fns/locale/ko";
import moment from "moment";
import { DateRange } from "react-date-range";
import React, { useState } from "react";
import { addDays } from "date-fns";
import styled from "styled-components";

const ModalCalendarRange = ({ settedDate }) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);
  const today = moment().add(0, "d").toDate();

  const onChange = (item) => {
    setState([item.selection]);
    settedDate(item.selection.startDate, item.selection.endDate);
  };

  return (
    <StyleDateRange
      locale={ko}
      minDate={today}
      onChange={onChange}
      showSelectionPreview={true}
      moveRangeOnFirstSelection={false}
      months={2}
      ranges={state}
      direction="horizontal"
      rangeColors={["#41C0FF"]}
      showDateDisplay={false}
    />
  );
};

const StyleDateRange = styled(DateRange)`
  font-size: 14px;
  border-radius: 7px;
  width: 812px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

export default ModalCalendarRange;
