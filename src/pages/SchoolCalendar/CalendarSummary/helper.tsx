export const eventType = [
    {
        id: "success",
        name: "Success",
    },
    {
        id: "warning",
        name: "Warning",
    },
    {
        id: "info",
        name: "Info",
    },
    {
        id: "primary",
        name: "Primary",
    },
];
export const getEventColors = (type: string) => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#0AB39C2D', 
          textColor: '#0AB39C'  
        };
      case 'danger':
        return {
          backgroundColor: '#F065482D', 
          textColor: '#F06548'    
        };
      case 'info':
        return {
          backgroundColor: '#299CDB2D', 
          textColor: '#299CDB'       
        };
      case 'warning':
        return {
          backgroundColor: '#F7B84B2D',
          textColor: '#F7B84B'      
        };
      case 'primary':
        return {
          backgroundColor: '#4051892D', 
          textColor: '#405189'      
        };
      default:
        return {
          backgroundColor: '#F8F9FA', 
          textColor: '#495057'      
        };
    }
  };
export const getColorName = (colorCode: string) => {
    switch (colorCode) {
      case "#0AB39C2D":
        return "success";
      case "#F065482D":
        return "danger";
      case "#299CDB2D":
        return "info";
      case "#F7B84B2D":
        return "warning";
      case "#4051892D":
        return "primary";
      default:
        return "";
    }
  };