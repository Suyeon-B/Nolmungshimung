import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import ko from "date-fns/locale/ko";
import moment from "moment";
import { Calendar } from "react-date-range";
import React, { useState } from "react";
import { addDays } from "date-fns";
import styled from "styled-components";

const ModalCalendar = ({ startDate, setStartDate }) => {
  const today = moment().add(0, "d").toDate();

  return (
    <Calendar
      locale={ko}
      minDate={today}
      onChange={(item) => setStartDate(item)}
      date={startDate}
      months={1}
      showDateDisplay={false}
      rangeColors={["#41C0FF"]}
      color="#41C0FF"
    />
  );
};

const StyleDateRange = styled(Calendar)`
  font-size: 14px;
  border-radius: 7px;
  width: 812px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;

export default ModalCalendar;
