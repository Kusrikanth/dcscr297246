export const selectData1 = [
    {
        linkType: "INTERNAL",
        text: "Internal Link"
    }
]


const cardColor = ["#C4F4E4", "#f2f5ff", "#e8fcff","#fde9ed","#D8D4FE","#FFF5D1"]; 
const bgColor = ["#1abe17", "#3d5ee1", "#6fccd8","#e82646","#8A82DA","#FFC107"];


export const transformResponseToQuickLinks = (response: any) => {
    if (!response) return [];
    
    const filteredResponse = response.filter(
      (item: any) => item.moduleName
    );
    return filteredResponse.map((item: any, index: any) => ({
      quickLinkId: index + 1,
      quickLinkTitle: item.moduleName,
      quickLinkCardColor: cardColor[index % cardColor.length], 
      quickLinkBgColor: bgColor[index % bgColor.length], 
      quickLinkIcon: "ri-bill-line", 
      quickLinkUrl: item.featureLink
    }));
  };