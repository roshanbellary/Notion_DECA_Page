var client = require("@notionhq/client")
const fs = require("fs")
const notion = new client.Client({ auth: process.env.NOTION_KEY })
const databaseId = process.env.NOTION_API_DATABASE
var jsonf = require('./data.json');
let queries = ["What name do you go by?","Username","What grade are you in?","How many years have you been in DECA?","What are some extracurriculars you are involved in?","Share your Myers Briggs result! (example : ENFJ)","Something interesting about yourself? Something you are passionate about?","What aspects of business are you interested in?","If you were a potato, what way would you like to be cooked?"]
let grades = {"Freshman":"9th","Sophomore":"10th","Junior":"11th","Senior":"12th"};
let programs = {"AMSE":"purple_background","BEI":"orange_background","Conservatory":"yellow_background","Athletics":"pink_background","ASB":"green_background","all":"blue_background"}
let years = {"1":"blue_background","2":"green_background","3":"purple_background","4":"orange_background"};
let interests = {"Marketing":"yellow_background","Finance":"pink_background","Hospitality + Tourism":"blue_background","Business Management + Administration":"purple_background"};
jsonf.forEach((person)=>{
  addItem(person[queries[0]],person[queries[1]],person[queries[2]],person[queries[3]],person[queries[4]],person[queries[5]],person[queries[6]],person[queries[7]],person[queries[8]])
})
async function addItem(name,email,grade,yearInDECA,Extracurriculars,MyersBriggs,Passions,BusinessInterests,Potato) {
  try {
    let extra = Extracurriculars.split(";");
    let extracurriculars=[];
    extra.forEach((activity)=>{
      let active = {
        "text":{
          "content":activity
        },
        "annotations":{
          "color":(programs[activity]==='undefined'?"grey_background":programs[activity])
        }
      }
      extracurriculars.push(active);
      let space = {
        "text":{
          "content":" "
        },
      };
      extracurriculars.push(space);
    })
    let business = BusinessInterests.split(";")
    let Sectors = [];
    business.forEach((interest)=>{
      let add = {
        "text":{
          "content":interest
        },
        "annotations":{
          "color":interests[interest]
        }
      }
      Sectors.push(add);
      let space = {
        "text":{
          "content":" "
        },
      };
      Sectors.push(space);
    })
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        title: { 
          title:[
            {
              "text": {
                "content": "🔷 "+name
              },
            }
          ]
        },
        "Grade":{
          "rich_text": [
            {
              "text": {
                "content": grades[grade]
              },
              "annotations":{
                "color":"orange_background"
              }
            },
          ]
        },
        "MyersBriggs":{
          "rich_text": [
            {
              "text": {
                "content": MyersBriggs
              },
              "annotations":{
                "color":"green_background"
              }
            }
          ]
        },
        "Years in DECA":{
          "rich_text": [
            {
              "text": {
                "content": ((yearInDECA!="1")?(yearInDECA+" years in DECA"):(yearInDECA)+"st year in DECA")
              },
              "annotations":{
                "color":years[yearInDECA]
              }
            }
          ]
        },
        "Extracurriculars":{
          "rich_text":extracurriculars
        },
        "Interesting Facts and Passions":{
          "rich_text": [
            {
              "text": {
                "content":Passions
              },
            }
          ]
        },
        "If you were a potato, how would you like to be cooked?":{
          "rich_text": [
            {
              "text": {
                "content":Potato
              },
            }
          ]
        },
        "Business Interests":{
          "rich_text": Sectors
        }
      },
    })
    console.log(response)
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error.body)
  }
}
