# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130310002553) do

  create_table "blocks", :force => true do |t|
    t.integer "x"
    t.integer "y"
    t.integer "color"
<<<<<<< HEAD
    t.string  "room_key", :limit => 7
=======
    t.string  "room_key"
>>>>>>> 743d753a2fa8d897956794c2f52ca044edd44f93
  end

  create_table "rooms", :force => true do |t|
    t.integer "width"
    t.integer "height"
    t.integer "prominent_hex"
    t.string  "room_key"
  end

  create_table "users", :force => true do |t|
    t.string  "user_key"
    t.string  "room_key"
    t.integer "color"
  end

end
