import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { Spectator, createTestComponentFactory, toHaveValue } from '@netbasal/spectator';

import { SigninComponent } from './signin.component';
import {IonicModule, NavController} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {NatuClientService} from '../../providers/natu-client.service';
import {Location} from '@angular/common';
import {AppComponent} from '../../app.component';
import {BrowserModule, By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {createComponent} from '@angular/compiler/src/core';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;

    // let host: SpectatorWithHost<SigninComponent>;
  let host: Spectator<SigninComponent>;
  const createHost = createTestComponentFactory(
    {
        component: SigninComponent,
        imports: [
            CommonModule,
            FormsModule,
            HttpClientModule,
            RouterTestingModule,
            IonicModule.forRoot(),
        ],
        providers: [ NatuClientService ],
    });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
          CommonModule,
          FormsModule,
          HttpClientModule,
          RouterTestingModule,
          IonicModule.forRoot(),
      ],
      declarations: [ SigninComponent ],
      providers: [ NatuClientService ],
      // bootstrap: [Location]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show empty if click submit with empty login', () => {

    let submit = fixture.debugElement.query(By.css('ion-button'))
      // submit.click()
    submit.triggerEventHandler('click', null) //click()
    expect(fixture.debugElement.query(By.css('#error_email'))).toBeTruthy()
    expect(fixture.debugElement.query(By.css('#error_password'))).toBeTruthy()

  });
  // it('should show empty  if click submit with empty login', async(() => {
  //
  //   // let inputUser = fixture.debugElement.query(By.css('ion-input[name=username]'))
  //   // inputUser.nativeElement.value = "something"
  //   //   fixture.detectChanges();
  //     let input : HTMLInputElement = fixture.debugElement.query(By.css('ion-input[name=username]')).nativeElement
  //     let submit = fixture.debugElement.query(By.css('ion-button'))
  //
  //     sendInput(input, 'something').then(()=>{
  //       submit.triggerEventHandler('click', null) //click()
  //       fixture.detectChanges()
  //       expect(fixture.debugElement.query(By.css('#error_password'))).toBeTruthy()
  //       expect(fixture.debugElement.query(By.css('#error_email')).nativeElement).toBeFalsy()
  //   })
  // }));

    it('should show empty  if click submit with empty login 2', () => {
        host = createHost()
        let input = host.query('ion-input[name=username]')  as HTMLInputElement
        host.typeInElement("somtehing", input)
        expect(input).toHaveValue("somtehing")
        // let inputUser = fixture.debugElement.query(By.css('ion-input[name=username]'))
        // inputUser.nativeElement.value = "something"
        // let submit = fixture.debugElement.query(By.css('ion-button'))
        // submit.triggerEventHandler('click', null) //click()
        let submit = host.query('ion-button') as HTMLButtonElement
        submit.click()
        host.detectChanges()
        // fixture.detectChanges();
        // expect(fixture.debugElement.query(By.css('#error_password'))).toBeTruthy()
        // expect(fixture.debugElement.query(By.css('#error_email'))).toBeFalsy()
        // expect(host.query('#error_email')).toBeFalsy((err)=> console.log("error ", err))

        expect(host.query('#error_email')).toBeHidden() //toBeVisible() //toBeFalsy()
        expect(host.query('#error_password')).toBeVisible() // .toBeTruthy()

    });
  it('should send the login form', () => {
    host = createHost()

    const user = {email: 'testuser@gmail.com', pass: 'testuser1234'};

    let inputUser = host.query('ion-input[name=username]')  as HTMLInputElement
    let inputPass = host.query('ion-input[name=password]')  as HTMLInputElement
    host.typeInElement(user.email, inputUser)
    host.typeInElement(user.pass, inputPass)
    expect(inputUser).toHaveValue(user.email)
    expect(inputPass).toHaveValue(user.pass)
    // let submit = fixture.debugElement.query(By.css('ion-button')) as HTMLButtonElement
    let submit = host.query('ion-button') as HTMLButtonElement
    submit.click()
    host.detectComponentChanges()
    // submit.triggerEventHandler('click', null) //click()
    expect(host.query('#error_email')).toBeHidden() // toBeFalsy()
    expect(host.query('#error_password')). toBeHidden() //.toBeTruthy()
  });

  afterEach(() => {
      fixture = null;
      component = null;
  });

    // must be called from within fakeAsync due to use of tick()
    function setInputValue(selector: string, value: string) {
        fixture.detectChanges();
        tick();

        let input = fixture.debugElement.query(By.css(selector)).nativeElement;
        input.value = value;
        input.dispatchEvent(new Event('input'));
        tick();
    }
    function sendInput(inputElement: any, text: string) {
        inputElement.value = text;
        inputElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        return fixture.whenStable();
    }

});
