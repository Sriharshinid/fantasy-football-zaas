// From: https://site.web.api.espn.com/apis/personalized/v2/scoreboard/header?sport=football&league=nfl&region=us&lang=en&contentorigin=espn&seasontype=3&weeks=4&dates=2025&playabilitySource=playbackId
// change weeks qp
// Wildcard: ["401772979", "401772981", "401772977", "401772980", "401772978", "401772976"]
// Divisional: ["401772982","401772984","401772983","401772985"]
// Conference Championships: ["401772986", "401772987"]
// Superbowl: ["401831718"]

import { Round } from "../interfaces/FantasyPlayer";

export const ROUND_TO_EVENTS: { [x: string]: string[]; } = {
    [Round.WILDCARD]: ["401772979", "401772981", "401772977", "401772980", "401772978", "401772976"],
    [Round.DIVISIONAL]: ["401772982","401772984","401772983","401772985"],
    [Round.CONFERENCE]: ["401772986", "401772987"],
    [Round.SUPERBOWL]: ["401831718"]
};

export const DIVISIONAL_INPUT: { [x: string]: string; }[] = [
    {
        "Name": "Daniel Z.",
        "Quarterback": "C.J. Stroud",
        "Running Back": "Christian McCaffrey",
        "Wide Receiver": "Puka Nacua",
        "Tight End": "Colston Loveland",
        "Kicker": "Ka'imi Fairbairn",
        "Flex (RB | WR | TE)": "Jaxon Smith-Njigba",
        "Defense & Special Teams": "Seahawks"
    },
    {
        "Name": "Leah Z.",
        "Quarterback": "Caleb Williams",
        "Running Back": "Christian McCaffrey",
        "Wide Receiver": "Jaxon Smith-Njigba",
        "Tight End": "Colston Loveland",
        "Kicker": "Jason Myers",
        "Flex (RB | WR | TE)": "Puka Nacua",
        "Defense & Special Teams": "Patriots"
    },
    {
        "Name": "Kevin G.",
        "Quarterback": "Brock Purdy",
        "Running Back": "James Cook III",
        "Wide Receiver": "Jaxon Smith-Njigba",
        "Tight End": "Hunter Henry",
        "Kicker": "Ka'imi Fairbairn",
        "Flex (RB | WR | TE)": "D'Andre Swift",
        "Defense & Special Teams": "Patriots"
    },
    {
        "Name": "Joel Z.",
        "Quarterback": "Josh Allen",
        "Running Back": "Christian McCaffrey",
        "Wide Receiver": "Jaxon Smith-Njigba",
        "Tight End": "Colston Loveland",
        "Kicker": "Matt Prater",
        "Flex (RB | WR | TE)": "D'Ernest Johnson",
        "Defense & Special Teams": "Bears"
    },
    {
        "Name": "Chris G.",
        "Quarterback": "Josh Allen",
        "Running Back": "Christian McCaffrey",
        "Wide Receiver": "Christian Kirk",
        "Tight End": "Dalton Kincaid",
        "Kicker": "Cairo Santos",
        "Flex (RB | WR | TE)": "Courtland Sutton",
        "Defense & Special Teams": "Seahawks"
    },
    {
        "Name": "Ben & Sarah K.",
        "Quarterback": "Caleb Williams",
        "Running Back": "Christian McCaffrey",
        "Wide Receiver": "Nico Collins",
        "Tight End": "Colston Loveland",
        "Kicker": "Jason Myers",
        "Flex (RB | WR | TE)": "",
        "Defense & Special Teams": "Texans"
    },
    {
        "Name": "Jeremy G.",
        "Quarterback": "Bo Nix",
        "Running Back": "Christian McCaffrey",
        "Wide Receiver": "Puka Nacua",
        "Tight End": "Hunter Henry",
        "Kicker": "Wil Lutz",
        "Flex (RB | WR | TE)": "Courtland Sutton",
        "Defense & Special Teams": "Patriots"
    }
];

const WILD_CARD_INPUT = [
 {
   "Name": "Daniel Z.",
   "Quarterback": "",
   "Running Back": "",
   "Wide Receiver": "",
   "Tight End": "",
   "Kicker": "",
   "Flex (RB | WR | TE)": "",
   "Defense & Special Teams": ""
 },
 {
   "Name": "Leah Z.",
   "Quarterback": "Matthew Stafford",
   "Running Back": "Josh Jacobs",
   "Wide Receiver": "Jakobi Meyers",
   "Tight End": "Dalton Schultz",
   "Kicker": "Cameron Dicker",
   "Flex (RB | WR | TE)": "James Cook III",
   "Defense & Special Teams": "Texans"
 },
 {
   "Name": "Kevin G.",
   "Quarterback": "Matthew Stafford",
   "Running Back": "Christian McCaffrey",
   "Wide Receiver": "Puka Nacua",
   "Tight End": "Pat Freiermuth",
   "Kicker": "Cam Little",
   "Flex (RB | WR | TE)": "Travis Etienne Jr.",
   "Defense & Special Teams": "Texans"
 },
 {
   "Name": "Joel Z.",
   "Quarterback": "Matthew Stafford",
   "Running Back": "TreVeyon Henderson",
   "Wide Receiver": "Puka Nacua",
   "Tight End": "Dallas Goedert",
   "Kicker": "Brandon Aubrey",
   "Flex (RB | WR | TE)": "Saquon Barkley",
   "Defense & Special Teams": "Rams"
 },
 {
   "Name": "Chris G.",
   "Quarterback": "Trevor Lawrence",
   "Running Back": "Kyren Williams",
   "Wide Receiver": "Puka Nacua",
   "Tight End": "Evan Engram",
   "Kicker": "Brandon McManus",
   "Flex (RB | WR | TE)": "Travis Etienne Jr.",
   "Defense & Special Teams": "Rams"
 },
 {
   "Name": "Ben & Sarah K.",
   "Quarterback": "Josh Allen",
   "Running Back": "Kyren Williams",
   "Wide Receiver": "Puka Nacua",
   "Tight End": "George Kittle",
   "Kicker": "Ka'imi Fairbairn",
   "Flex (RB | WR | TE)": "",
   "Defense & Special Teams": "Steelers"
 },
 {
   "Name": "Jeremy G.",
   "Quarterback": "Josh Allen",
   "Running Back": "Christian McCaffrey",
   "Wide Receiver": "Puka Nacua",
   "Tight End": "Colston Loveland",
   "Kicker": "Cam Little",
   "Flex (RB | WR | TE)": "Saquon Barkley",
   "Defense & Special Teams": "Texans"
 }
];

export const roundToPicks = {
    [Round.WILDCARD]: WILD_CARD_INPUT,
    [Round.DIVISIONAL]: DIVISIONAL_INPUT,
    [Round.CONFERENCE]: [],
    [Round.SUPERBOWL]: [],
};
