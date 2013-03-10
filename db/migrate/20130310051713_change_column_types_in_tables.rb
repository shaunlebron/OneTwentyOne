class ChangeColumnTypesInTables < ActiveRecord::Migration
  def change
    change_column :rooms, :prominent_hex, :integer
    change_column :colors, :hex, :integer
    change_column :block, :color, :integer 
  end
end
