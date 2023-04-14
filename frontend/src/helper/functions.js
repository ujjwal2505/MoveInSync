import moment from "moment";

export const checkisTimeBetween = (start, end) => {
  let forma = "HH:mm";
  const time = moment();
  const beforeTime = moment(moment(start).format(forma), forma);
  const afterTime = moment(moment(end).format(forma), forma);

  return time.isBetween(beforeTime, afterTime);
};
