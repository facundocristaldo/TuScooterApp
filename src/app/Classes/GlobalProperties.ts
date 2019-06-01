
export class GlobalProperties{
    
    static _httpheader = {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Connection-Timeout': '5000'
      };

    public get httpheader() : {} {

        return GlobalProperties._httpheader;
    }

    public set httpheader(head:{}) {
        this.httpheader = head;
    }
    
}