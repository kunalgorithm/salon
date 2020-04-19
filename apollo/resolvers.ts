import { AuthenticationError, UserInputError } from "apollo-server-micro";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import getConfig from "next/config";
import bcrypt from "bcrypt";
import v4 from "uuid/v4";
import { PrismaClient, Player, Salon } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export interface Context {
  prisma: PrismaClient;
  req: NextApiRequest;
  res: NextApiResponse;
}

const JWT_SECRET = "appsecret123";

const users: {
  id: string;
  name: string;
  email: string;
  password: string;
}[] = [];

function validPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

export const resolvers = {
  Query: {
    async me(_parent, _args, ctx: Context, _info) {
      const { token } = cookie.parse(ctx.req.headers.cookie ?? "");

      if (token) {
        try {
          const { id, name } = jwt.verify(token, JWT_SECRET);

          return await ctx.prisma.player.findOne({ where: { id } });
        } catch {
          throw new AuthenticationError(
            "Authentication token is invalid, please log in"
          );
        }
      }
    },
    async player(
      _parent,
      args: { id: number },
      ctx: Context,
      _info
    ): Promise<Player> {
      return await ctx.prisma.player.findOne({ where: { id: args.id } });
    },
    async players(_parent, _args, ctx: Context, _info): Promise<Player[]> {
      return ctx.prisma.player.findMany({ orderBy: { createdAt: "desc" } });
    },
    async salon(_parent, args, ctx: Context, _info): Promise<Salon> {
      return ctx.prisma.salon.findOne({ where: { id: args.id } });
    },
    async salons(_parent, _args, ctx: Context, _info): Promise<Salon[]> {
      return ctx.prisma.salon.findMany({ orderBy: { createdAt: "desc" } });
    },
  },

  Mutation: {
    async createSalon(
      _parent,
      args: { title: string },
      ctx: Context,
      _info
    ): Promise<Salon> {
      return await ctx.prisma.salon.create({
        data: {
          title: args.title,
        },
      });
    },
    async move(
      _parent,
      args: { x_position: number; y_position: number; rotation: number },
      ctx: Context,
      _info
    ): Promise<Player> {
      const { token } = cookie.parse(ctx.req.headers.cookie ?? "");
      const { id, name } = jwt.verify(token, JWT_SECRET);
      if (!id)
        throw new AuthenticationError(
          "You must join this salon to move your player."
        );

      return await ctx.prisma.player.update({
        where: { id },
        data: {
          ...args,
        },
      });
    },
    async join(
      _parent,
      { salonId, name }: { salonId: string; name?: string },
      ctx: Context,
      _info
    ): Promise<Player> {
      if (!name) {
        const { token } = cookie.parse(ctx.req.headers.cookie ?? "");
        const { id, name } = jwt.verify(token, JWT_SECRET);
        await ctx.prisma.salon.update({
          where: { id: salonId },
          data: { players: { connect: { id } } },
        });
        return ctx.prisma.player.findOne({ where: { id } });
      }

      const player = await ctx.prisma.player.create({
        data: {
          name: name,
          salon: { connect: { id: salonId } },
        },
      });

      const token = jwt.sign(
        { name: player.name, id: player.id, time: new Date() },
        JWT_SECRET,
        {
          expiresIn: "6h",
        }
      );

      ctx.res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          maxAge: 6 * 60 * 60,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        })
      );
      return player;
    },

    async signOut(_parent, _args, ctx: Context, _info) {
      ctx.res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", "", {
          httpOnly: true,
          maxAge: -1,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        })
      );

      return true;
    },
  },
  Salon: {
    async players(parent, _args, ctx: Context, _info) {
      const { token } = cookie.parse(ctx.req.headers.cookie ?? "");
      const { id, name } = jwt.verify(token, JWT_SECRET);
      const players = await ctx.prisma.salon
        .findOne({ where: { id: parent.id } })
        .players({ where: { NOT: { id } } });
      return players.filter((p) => p.id !== id);
    },
  },
};
