import { Injectable } from "@angular/core";
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


export class LocalNotif{

    private localnotif:LocalNotifications = new LocalNotifications();
    private toastController:ToastController = new ToastController(this);

    sendNotif(data){
        console.log("Notificación: " +data+".")
        if (this,this.toastController==null || this.toastController==undefined){
            this.toastController = new ToastController(this);
            this.toastController.create({
                message:"Notificación: "+data+".",
                duration:5000
            }).then(e=>e.present())
        }else{
            this.toastController.create({
                message:"Notificación: "+data+".",
                duration:5000
            }).then(e=>e.present())
        }
        console.log("Notificacion: "+data)
        if (this.localnotif==null || this.localnotif==undefined){
            this.localnotif = new LocalNotifications()
        }
        if (this.toastController==null || this.toastController==undefined){
            this.toastController = new ToastController(this);
        }
        try{
            this.localnotif.schedule({
                title:"TuScooter",
                text: data,
                trigger:{
                    in:1,
                    unit: ELocalNotificationTriggerUnit.SECOND
                }
            })
/*            if(this.localnotif.hasPermission()){
                this.localnotif.schedule({
                    title:"TuScooter",
                    text: data,
                    trigger:{
                        in:1,
                        unit: ELocalNotificationTriggerUnit.SECOND
                    }
                })  
            }else{
                this.localnotif.requestPermission().then((value)=>{
                    if (value == true){
                        this.localnotif.schedule({
                            title:"TuScooter",
                            text: data,
                            trigger:{
                                in:1,
                                unit: ELocalNotificationTriggerUnit.SECOND
                            }
                        })
                    }else{

                        this.toastController.create({
                            message:"Notificacion: "+data+".",
                            duration:5000
                        }).then(e=>e.present())
                    }
                }).catch(()=>{

                    this.toastController.create({
                        message:"Notificacion: "+data+".",
                        duration:5000
                    }).then(e=>e.present())
                });
                }
            */
            }catch(err){
            console.log("Error en notificacion |"+err.message+"|")
            this.toastController.create({
                message:"Notificacion: "+data+".",
                duration:5000
            }).then(e=>e.present())
        }
    }
}