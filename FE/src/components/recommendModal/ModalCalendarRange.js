import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import ko from "date-fns/locale/ko";
import moment from "moment";
import { DateRange } from "react-date-range";
import React, { useState } from "react";
import { addDays } from "date-fns";
import styled from "styled-components";

const ModalCalendarRange = ({ setStartDate, setSelectDate }) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  const today = moment().add(0, "d").toDate();

  const onChange = (item) => {
    const term =
      (item.selection.endDate - item.selection.startDate) /
      (1000 * 60 * 60 * 24);
    setState([item.selection]);
    setStartDate(item.selection.startDate);
    const dateArr = new Array(term + 1).fill(null);
    setSelectDate(dateArr);
  };

  return (
    <DateRange
      locale={ko}
      minDate={today}
      showSelectionPreview={true}
      // editableDateInputs={true}
      onChange={onChange}
      moveRangeOnFirstSelection={false}
      ranges={state}
      showDateDisplay={false}
      rangeColors={["#41C0FF"]}
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
