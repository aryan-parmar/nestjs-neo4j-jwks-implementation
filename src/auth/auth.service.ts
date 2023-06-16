import { HttpException, Injectable } from '@nestjs/common';
import neo4j from 'neo4j-driver';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  private driver: any;
  private session: any;
  init() {
    this.driver = neo4j.driver(
      'bolt://127.0.0.1:7687',
      neo4j.auth.basic('neo4j', '9512388235'),
      { disableLosslessIntegers: true },
    );
    this.driver
      .verifyConnectivity()
      .then(() => {
        console.log('Connected to Neo4j');
        this.session = this.driver.session();
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  async login(email: string, password: string) {
    try {
      const o = await this.session.executeRead((tx: any) =>
        tx.run('MATCH (a:Person {email: $email}) RETURN a', {
          email: email,
        }),
      );
      if (o.records.length == 0) {
        throw new HttpException({ message: 'user not found' }, 404);
      }
      const user = o.records[0].get(0).properties;
      if (bcrypt.compareSync(password, user.password)) {
        let payload = { username: user.name, email: user.email };
        return {
          access_token: this.jwtService.sign(payload),
        };
      } else {
        throw new HttpException({ message: 'invalid password' }, 400);
      }
    } catch (error) {
      throw new HttpException({ message: 'user not found' }, 404);
    }
  }
  async register(name: string, email: string, password: string) {
    password = await bcrypt.hash(password, 10);
    try {
      await this.session.executeWrite((tx: any) =>
        tx.run(
          'MERGE (a:Person {name: $name, email: $email, password: $password}) ON CREATE SET a.createdOn = datetime() RETURN a',
          {
            name: name,
            email: email,
            password: password,
          },
        ),
      );
      return { message: 'User registered successfully' };
    } catch (error) {
      throw new HttpException({ message: 'user already exists' }, 400);
    }
    // let payload = { username: name };
    // return {
    //     access_token: await this.jwtService.signAsync(payload),
    // };
  }
}
